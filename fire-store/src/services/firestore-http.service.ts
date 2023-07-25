import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FireCommonService } from '@annuadvent/ngx-tools/fire-common';
import { FirestoreParserService } from './firestore-parser.service';
import { FireQuery } from '../interfaces/fire-query.interface';
import { FirestoreQueryService } from './firestore-query.service';
import { BIN_COLLECTION_POSTFIX, RUN_QUERY_KEYWORD } from '../constants/firestore.constants';

@Injectable({
  providedIn: 'root'
})
export class FirestoreHttpService {

  constructor(
    private fireCommonService: FireCommonService,
    private http: HttpClient,
    private firestoreParser: FirestoreParserService,
    private firestoreQueryService: FirestoreQueryService,
  ) { }

  public async runQueryById(collectionId: string, id: string): Promise<any> {
    const firestoreApiUrl = this.fireCommonService.firebaseConfig?.store?.firestoreBaseApiUrl;

    return new Promise((resolve, reject) => {
      if (!collectionId || !id) {
        reject('Please provide a valid collection id and document id.');
      } else {
        const url = `${firestoreApiUrl}/${collectionId}/${id}`;
        const httpSubscription = this.http.get(url).subscribe({
          next: (queryResult: any) => {
            const parsedQueryResult: any = this.firestoreParser.parse(queryResult);
            httpSubscription.unsubscribe();
            resolve(parsedQueryResult);
          },
          error: reject,
        });
      }
    });
  }

  public async runQueryByConfig(
    fireQuery: FireQuery
  ): Promise<Array<any>> {
    const firestoreApiUrl = this.fireCommonService.firebaseConfig?.store?.firestoreBaseApiUrl;

    return new Promise((resolve, reject) => {
      const url = `${firestoreApiUrl}${RUN_QUERY_KEYWORD}`;

      const httpSubscription = this.http
        .post(
          url,
          this.firestoreQueryService.fireToStructuredQuery(fireQuery)
        )
        .subscribe({
          next: (queryResult: any) => {
            const parsedQueryResult: Array<any> = this.firestoreParser.parse(
              queryResult
            );
            httpSubscription.unsubscribe();
            resolve(parsedQueryResult);
          },
          error: (err) => reject({ config: fireQuery, error: err }),
        });
    });
  }

  public async runQueryToUpdate(
    collectionId: string,
    collectionDoc: any,
    fieldsToUpdate: Array<string>,
    isBin: boolean = false
  ): Promise<any> {
    const firestoreApiUrl = this.fireCommonService.firebaseConfig?.store?.firestoreBaseApiUrl;

    if (!collectionDoc || !collectionDoc.id) throw new Error('Please provide a valid collection document');

    // If update to Bin collection, then postfix collectionId with '-bin'
    if (isBin === true) collectionId = `${collectionId}${BIN_COLLECTION_POSTFIX}`;

    const pCollectionDoc = { ...collectionDoc };
    delete pCollectionDoc.id;

    return new Promise((resolve, reject) => {
      const url = `${firestoreApiUrl}/${collectionId}/${collectionDoc.id}`;
      const body = this.firestoreParser.buildFirebaseFields(
        pCollectionDoc,
        fieldsToUpdate
      );
      const params =
        this.firestoreParser.buildQueryParamsToUpdate(fieldsToUpdate);

      const httpSubscription = this.http
        .patch(url, body, { params })
        .subscribe({
          next: (queryResult: any) => {
            const updatedCollectionDoc: any = this.firestoreParser.parse(
              queryResult
            );
            httpSubscription.unsubscribe();
            resolve(updatedCollectionDoc);
          },
          error: reject,
        });
    });
  }

  public async runQueryToDelete(collectionId: string, collectionDoc: any): Promise<boolean> {
    const firestoreApiUrl = this.fireCommonService.firebaseConfig?.store?.firestoreBaseApiUrl;

    if (!collectionDoc || !collectionDoc.id)
      throw new Error('Please provide a valid collectionDoc.');

    return new Promise((resolve, reject) => {
      // Copy to collectionDocs bin, then delete from collectionDocs db.
      this.runQueryToUpdate(collectionId, collectionDoc, null, true)
        .then(() => {
          const url = `${firestoreApiUrl}/${collectionId}/${collectionDoc.id}`;
          // delete from collectionDocs db.
          const httpSubscription = this.http.delete(url).subscribe({
            next: (res: any) => {
              httpSubscription.unsubscribe();
              resolve(true);
            },
            error: reject,
          });
        })
        .catch(reject);
    });
  }

}
