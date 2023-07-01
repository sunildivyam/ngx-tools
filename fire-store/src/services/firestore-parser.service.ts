import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseDocument } from '../interfaces/fire-doc.interface';
import {
  StructuredQueryArrayValue,
  StructuredQueryMapValue,
  StructuredQueryValue,
} from '../interfaces/structured-query.interface';
import {
  StructuredQueryValueType
} from '../enums/structured-query.enums';


@Injectable()
export class FirestoreParserService {

  constructor() { }

  private getFireStoreProp(value: any): string | undefined {
    const props: Array<string> = [
      'arrayValue',
      'bytesValue',
      'booleanValue',
      'doubleValue',
      'geoPointValue',
      'integerValue',
      'mapValue',
      'nullValue',
      'referenceValue',
      'stringValue',
      'timestampValue',
      'fields',
      'document'
    ];
    return Object.keys(value).find(k => props.includes(k));
  }

  public parse(value: any) {
    // Remove readTime
    if (value instanceof Array) {
      if (value.length === 1 && typeof value[0] === 'object' && Object.keys(value[0]).includes('readTime') && Object.keys(value[0]).length === 1) {
        value.splice(0, 1);
      }
    }

    if (typeof value === 'object') {
      const objKeys = Object.keys(value);
      if (objKeys.includes('readTime')) delete value.readTime;
    }


    const prop = this.getFireStoreProp(value);

    if (prop === 'doubleValue' || prop === 'integerValue') {
      value = Number(value[prop]);
    }
    else if (prop === 'arrayValue') {
      value = (value[prop] && value[prop].values || []).map((v: any) => this.parse(v))
    }
    else if (prop === 'mapValue') {
      value = this.parse(value[prop] && value[prop].fields || {})
    }
    else if (prop === 'geoPointValue') {
      value = { latitude: 0, longitude: 0, ...value[prop] }
    }
    // extract and add id to the document.
    else if (prop === 'fields') {
      const nextValue = value[prop];
      const docName: string = value.name;
      if (docName && nextValue) {
        const docId = docName.substring(docName.lastIndexOf('/') + 1);
        value[prop].id = docId;
      }
      value = this.parse(value[prop])
    }
    else if (prop === 'document') {
      const nextValue = value[prop];
      const docName: string = nextValue.name;
      if (docName && nextValue.fields) {
        const docId = docName.substring(docName.lastIndexOf('/') + 1);
        value[prop].fields.id = docId;
      }
      value = this.parse(value[prop])
    }
    else if (prop) {
      value = value[prop]
    }
    else if (typeof value === 'object') {
      Object.keys(value).forEach(k => value[k] = this.parse(value[k]))
    }

    return value;
  }

  public buildFirebaseFields(doc: Object, fieldsToUpdate: Array<string>): FirebaseDocument {
    if (!doc) throw new Error('Please provide a valid document object containing one or more fields.');

    const firebaseDoc: FirebaseDocument = {
      fields: {}
    };

    if (fieldsToUpdate && fieldsToUpdate.length) {
      const missingPropsOnDoc = [];
      fieldsToUpdate.forEach(fieldName => {
        const fieldValue = doc[fieldName];
        // ensures fieldsToUpdate field has its property on doc, else remove it from fields to update.
        if (typeof fieldValue !== 'undefined') {
          firebaseDoc.fields[fieldName] = this.getFieldStructuredValue(fieldValue);
        } else {
          missingPropsOnDoc.push(fieldName);
        }
      });

      // remove missing props (undefined) from the fieldsToUpdate. As firestore does not update missing properties.
      fieldsToUpdate = fieldsToUpdate.filter(fieldName => !missingPropsOnDoc.includes(fieldName));
    } else {
      firebaseDoc.fields = this.getFieldStructuredValue(doc).mapValue.fields;
    }

    return firebaseDoc;
  }

  public getFieldStructuredValue(value: any): StructuredQueryValue {
    let valueType: StructuredQueryValueType;
    if (typeof value === 'number') {
      valueType = StructuredQueryValueType.doubleValue;
    } else if (typeof value === 'string') {
      valueType = StructuredQueryValueType.stringValue;
    } else if (typeof value === 'boolean') {
      valueType = StructuredQueryValueType.booleanValue;
    } else if (value instanceof Array) {
      valueType = StructuredQueryValueType.arrayValue;
      const arrayValue: StructuredQueryArrayValue = { values: [] };
      value.forEach(itemValue => {
        arrayValue.values.push(this.getFieldStructuredValue(itemValue));
      });
      value = arrayValue;
    } else if (typeof value === 'object') {
      valueType = StructuredQueryValueType.mapValue;
      const mapValue: StructuredQueryMapValue = { fields: {} };
      Object.keys(value).forEach(key => mapValue.fields[key] = this.getFieldStructuredValue(value[key]));
      value = mapValue;
    }
    const structuredQueryValue: StructuredQueryValue = { [valueType]: value };

    return structuredQueryValue;
  }

  public buildQueryParamsToUpdate(fieldsToUpdate: Array<string>): HttpParams {
    let params: HttpParams = new HttpParams();

    fieldsToUpdate?.forEach(fieldName => {
      params = params.append('updateMask.fieldPaths', fieldName);
    });

    return params;
  }
}
