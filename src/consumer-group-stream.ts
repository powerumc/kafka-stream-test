import { connect, clientOption } from "./common";
import { ConsumerGroupStream } from "kafka-node";

async function listenConsumerGroupStream(client, topicName): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const consumerGroupStream = new ConsumerGroupStream({
            autoCommit: false,
            groupId: "test-group",
            protocol: ["roundrobin"],
            kafkaHost: clientOption.kafkaHost
        }, topicName)

        const read = consumerGroupStream.read(1);
        consumerGroupStream.on("close", () => {console.log("close");});
        consumerGroupStream.on("error", (error) => {console.error(error);});
        consumerGroupStream.on("readable", () => {
            console.log("readable");
            console.log(read);
        });
        consumerGroupStream.on("data", (chunk) => {
            console.log("data");
            console.log(chunk);
            consumerGroupStream.commit(chunk, true, (error, data) => {
                if (error) {
                    console.error(error);
                    return;
                }

                console.log("commit");
                console.log(data);
            });
        });
        consumerGroupStream.on("end", () => {console.log("end");});
    });
}

(async() => {
    const client = await connect();
    await listenConsumerGroupStream(client, "test");
})();