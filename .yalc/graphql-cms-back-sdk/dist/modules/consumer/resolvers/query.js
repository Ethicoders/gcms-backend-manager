"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Query: {
        getConsumer: async (root, { id }, { injector }) => {
            const consumer = await (await injector.get('DB'))
                .collection('consumers')
                .find({ _id: id })
                .limit(1)
                .toArray()[0];
            return {
                consumer,
            };
        },
        getConsumers: async (root, { id }, { injector }) => {
            const consumers = await (await injector.get('DB'))
                .collection('consumers')
                .find()
                .toArray();
            return consumers;
        },
    },
};
//# sourceMappingURL=query.js.map