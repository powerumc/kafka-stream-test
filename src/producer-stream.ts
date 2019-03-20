import { connect, createTopic, clientOption } from "./common";
import { KafkaClient, ProducerStream } from "kafka-node";

async function sendMessage(client: KafkaClient, topicName: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const producerStream = new ProducerStream({
            kafkaClient: clientOption,
            producer: {
                ackTimeoutMs: 100,
                requireAcks: 1
            }
        });

        producerStream.on("close", () => { console.log("close"); });
        producerStream.on("drain", () => { console.log("drain"); });
        producerStream.on("error", error => { console.error(error); });
        producerStream.on("finish", () => { console.log("finish"); });
        producerStream.on("pipe", (src) => {
            console.log("pipe");
        });
        producerStream.on("unpipe", (src) => {
            console.log("unpipe");
        });

        const partition = Math.floor(Math.random() * (10 - 1) + 1);
        console.log(`Send message=${message} partition=${partition}`);
        producerStream.sendPayload([{
            topic: topicName,
            messages: message,
            partition: partition
        }], (error, data) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log(data);
        })

    });
}

(async () => {
    const client = await connect();
    await createTopic(client, "test");

    setInterval(async () => {
        await sendMessage(client, "test", "Hell World " + Math.floor((Math.random() * 100)));
    }, 5000);

})();