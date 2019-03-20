import { KafkaClient, Consumer, Offset, ConsumerGroup } from "kafka-node";

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

async function listenConsumerGroup(topicName): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const consumerGroup = new ConsumerGroup({
            kafkaHost: "localhost:9092",
            autoCommit: true,
            groupId: "test-group",
            protocol: ["roundrobin"]
        }, topicName);

        consumerGroup.on("message", message => {
            console.log(message);
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
    await connect();
    await listenConsumerGroup("test");
})();