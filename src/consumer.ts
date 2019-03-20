import { KafkaClient, Consumer } from "kafka-node";
import { connect } from "./common";


async function listenConsumer(client: KafkaClient, topicName: string): Promise<void> {
    return new Promise<void>(() => {
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
        });
        consumer.on("error", error => {
            console.error(error);
        });
    });
}

(async() => {
    const client = await connect();
    await listenConsumer(client, "test");
})();