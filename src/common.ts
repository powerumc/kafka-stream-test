import { KafkaClient, CreateTopicResponse } from "kafka-node";

export const clientOption = {
    kafkaHost: "localhost:9092",
    autoConnect: true
};
const client = new KafkaClient(clientOption);
client.setMaxListeners(0);

export async function connect(): Promise<KafkaClient> {
    return new Promise<KafkaClient>((resolve, reject) => {
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
            resolve(client);
        });
    });
}

export async function createTopic(client: KafkaClient, name: string): Promise<CreateTopicResponse[]> {
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