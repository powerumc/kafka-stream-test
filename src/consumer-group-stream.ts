import { connect, clientOption } from "./common";
import { ConsumerGroupStream } from "kafka-node";
import { Sema } from "async-sema";

const semaphore = new Sema(1);

async function listenConsumerGroupStream(client, topicName): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const consumerGroupStream = new ConsumerGroupStream({
            autoCommit: true,
            groupId: "test2-group",
            protocol: ["roundrobin"],
            kafkaHost: clientOption.kafkaHost,
            maxTickMessages: 1,
            retries: 3
        }, topicName)

        consumerGroupStream.on("close", () => { console.log("close"); });
        consumerGroupStream.on("error", (error) => { console.error(error); });
        consumerGroupStream.on("readable", () => { console.log("readable"); });

        consumerGroupStream.on("data", async (chunk) => {
            console.log(chunk.value);

            await semaphore.acquire();

            try {
                await delay(chunk.value, 2000);
            }
            finally {
                semaphore.release();
            }
        });
        consumerGroupStream.on("end", () => { console.log("end"); });
    });
}

async function delay(message: string, ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            console.log(message + " completed");
            resolve();
        }, ms);
    })
}

(async () => {
    const topic = "test6";
    const client = await connect();
    await listenConsumerGroupStream(client, topic);
})();