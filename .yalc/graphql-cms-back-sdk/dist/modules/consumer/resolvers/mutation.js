"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const APP_SECRET = 'test';
exports.default = {
    Mutation: {
        updateConsumer: async (root, { consumer }, { injector }) => {
            (await injector.get('DB')).collection('consumers').updateOne({ _id: new mongodb_1.ObjectId(consumer.id) }, {
                $set: consumer,
            });
            return {
                consumer,
            };
        },
        signUp: async (root, { login, password }, { injector }) => {
            const db = await injector.get('DB');
            const collection = db.collection('consumers');
            const hashedPassword = await bcryptjs_1.hash(password, 10);
            const { insertedId } = await collection.insertOne({
                login,
                password: hashedPassword,
            });
            const consumer = await collection
                .find({ _id: new mongodb_1.ObjectId(insertedId) })
                .limit(1)
                .toArray()[0];
            const token = jsonwebtoken_1.sign({ userId: insertedId }, APP_SECRET);
            return {
                token,
                consumer,
            };
        },
        signIn: async (root, { login, password }, { injector }) => {
            const consumers = await (await injector.get('DB'))
                .collection('consumers')
                .find({ login })
                .limit(1)
                .toArray();
            if (!consumers[0]) {
                throw new Error('No such user found');
            }
            const consumer = consumers[0];
            const valid = await bcryptjs_1.compare(password, consumer.password);
            if (!valid) {
                throw new Error('Invalid password');
            }
            const token = jsonwebtoken_1.sign({ userId: consumer._id }, APP_SECRET);
            return {
                token,
                consumer,
            };
        },
    },
};
//# sourceMappingURL=mutation.js.map