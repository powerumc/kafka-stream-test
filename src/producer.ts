import { CreateTopicResponse, KafkaClient, Producer } from "kafka-node";

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
            console.log("reconnect");
        });
        client.on("ready", () => {
            console.log("ready");
            resolve();
        });
    });
}

async function createTopic(name): Promise<CreateTopicResponse[]> {
    return new Promise<CreateTopicResponse[]>((resolve, reject) => {
        client.createTopics([
            {
                topic: name,
                partitions: 10,
                replicationFactor: 1,
                configEntries: [
                    {
                        name: 'compression.type',
                        value: 'gzip'
                    }
                ]
            }
        ], (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            console.log(result);
            resolve(result);
        });
    });
}

async function sendMessage(topicName, message): Promise<any> {
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
        await connect();
        await createTopic("test");
        setInterval(async () => {
            await sendMessage("test", "Hell World " + Math.floor((Math.random() * 100)));
        }, 5000);
    } catch (e) {
        console.error(e);
    }
})();