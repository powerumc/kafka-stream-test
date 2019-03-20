import { KafkaClient, Consumer, Offset } from "kafka-node";

const client = new KafkaClient({
    kafkaHost: "localhost:9092",
    autoConnect: true
});
client.setMaxListeners(0);

async function connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        client.on("connect", () => {
            console.log("connected");
        });
        client.on("close", () => {
            console.log("close");
        });
        client.on("error", error => {
            reject(error);
        });
        client.on("reconnect", () => {
            console.log("erconnect");
        });
        client.on("ready", () => {
            console.log("ready");
            resolve();
        });
    });
}

async function listenConsumer(topicName): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const consumer = new Consumer(client, [{
            topic: topicName,
        }], {
            autoCommit: true
        });
        consumer.on("message", message => {
            console.log("onmessage");
            console.log(message);
            
        });
        consumer.on("offsetOutOfRange", topic => {
            console.log(topic);
            // topic.maxNum = 2;
            // offset.fetch([topic], function (err, offsets) {
            //     if (err) {
            //     return console.error(err);
            //     }
            //     var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
            //     consumer.setOffset(topic.topic, topic.partition, min);
            // });
        });
        consumer.on("error", error => {
            console.error(error);
        });
    });
}

(async() => {
    await connect();
    await listenConsumer("test");
})();