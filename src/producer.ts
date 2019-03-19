import {CreateTopicResponse, KafkaClient, Producer} from "kafka-node";

const client = new KafkaClient({
    kafkaHost: "localhost:9092",
    autoConnect: true
});
client.setMaxListeners(0);

async function connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        client.on("connect", () => {
            console.log("connected");
            resolve();
        });
        client.on("close", () => {
            console.log("close");
        });
        client.on("error", error => {
            reject(error);
        })
    });
}

async function createTopic(name): Promise<CreateTopicResponse[]> {
    return new Promise<CreateTopicResponse[]>((resolve, reject) => {
        client.createTopics([
            {
                topic: name,
                partitions: 1,
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

async function ready(): Promise<Producer> {
    return new Promise<Producer>((resolve, reject) => {
        const producer = new Producer(client);
        producer.on("ready", () => {
            console.log("ready");
            resolve(producer);
        });
        producer.on("error", error => {
            console.error(error);
            reject();
        })
    });
}

(async () => {
    try {
        await connect();
        await createTopic("test");
    } catch (e) {
        console.error(e);
    }
})();