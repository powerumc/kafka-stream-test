import { CreateTopicResponse, KafkaClient, Producer } from "kafka-node";
import { connect, createTopic } from "./common";

async function sendMessage(client: KafkaClient, topicName: string, message: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        const producer = new Producer(client, {
            requireAcks: 1,
            ackTimeoutMs: 100
        });
        const partition = Math.floor(Math.random() * (10 - 1) + 1);
        producer.send([{
            topic: topicName,
            messages: message,
            partition: partition
        }], (error, data) => {
            if (error) reject(error);

            console.log(`Send message=${message} partition=${partition}`);
            console.log(data);
            resolve(data);
        });
        producer.on("error", (error) => {
            console.error(error);
            reject(error);
        });
    });
}

(async () => {
    try {
        const client = await connect();
        await createTopic(client, "test");
        setInterval(async () => {
            await sendMessage(client, "test", "Hell World " + Math.floor((Math.random() * 100)));
        }, 5000);
    } catch (e) {
        console.error(e);
    }
})();