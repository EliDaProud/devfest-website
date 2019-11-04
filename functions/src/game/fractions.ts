import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ErrorResponse, WaterGiveSuccessfulResponse } from './responses';
import { assoc, propOr } from 'ramda';
import { CallableContext } from 'firebase-functions/lib/providers/https';

const db = admin.firestore();

export const giveWater = functions.https.onCall(async (data: any, context: CallableContext) => {
    const fractionId = data.fractionId;
    const water = data.water;
    const number = data.number;

    if (fractionId && number && water) {
        const userSnap = await db.collection('users').doc(number).get();
        const userData = userSnap.data();

        const actualScore = propOr(0, 'actualScore', userData);

        if (actualScore >= water) {
            await db.collection('users').doc(number).set(assoc('actualScore', actualScore - water, userData));             
            console.log('Success');
            return new WaterGiveSuccessfulResponse();
        } else {
            console.log('Water error');
            return new ErrorResponse('Not enought of water.');
        }
    } else {
        console.log('UID error.');
        return new ErrorResponse('No user id provided.');
    }
});