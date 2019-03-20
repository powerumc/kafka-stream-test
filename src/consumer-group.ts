import { KafkaClient, ConsumerGroup, Offset } from "kafka-node";
import { connect } from "./common";


async function listenConsumerGroup(client: KafkaClient, topicName: string | string[]): Promise<void> {
    return new Promise<void>(() => {
        const consumerGroup = new ConsumerGroup({
            kafkaHost: "localhost:9092",
            autoCommit: true,
            groupId: "test-group",
            protocol: ["roundrobin"],
            maxTickMessages: 1,
            fetchMaxWaitMs: 1000
        }, topicName);

        consumerGroup.on("message", message => {
            console.log("onmessage");
            consumerGroup.pause();
            console.log(message);
            setTimeout(() => {
                consumerGroup.resume();
            }, 1000);
        });
        consumerGroup.on("error", error => {
            console.error(error);
        });
        consumerGroup.on("offsetOutOfRange", error => {
            console.log("offsetOutOfRange");
            console.log(error);
        });
        consumerGroup.on("rebalancing", () => {
            console.log("rebalancing");
        });
        consumerGroup.on("rebalanced", () => {
            console.log("rebalanced");
        });
    });
}

(async() => {
    const client = await connect();
    await listenConsumerGroup(client, "test");
})();