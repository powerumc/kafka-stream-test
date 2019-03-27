import { KafkaClient, CreateTopicResponse, KafkaClientOptions, MetadataResponse } from "kafka-node";

export const clientOption: KafkaClientOptions = {
    kafkaHost: "localhost:9092",
    autoConnect: true
};

export async function connect(): Promise<KafkaClient> {
    return new Promise<KafkaClient>((resolve, reject) => {
        const client = new KafkaClient(clientOption);
        client.setMaxListeners(0);

        client.on("connect", () => { console.log("connect"); });
        client.on("close", () => { console.log("close"); });
        client.on("error", error => {
            reject(error);
        });
        client.on("reconnect", () => { console.log("erconnect"); });
        client.on("ready", () => {
            console.log("ready");
            resolve(client);
        });
        client.on("brokersChanged", () => { console.log("brokersChanged"); });
        client.on("socket_error", error => { console.error(error); });
        client.on("zkReconnect", () => { console.log("zkReconnect"); });
    });
}

export async function createTopic(client: KafkaClient, name: string): Promise<CreateTopicResponse[]> {
    return new Promise<CreateTopicResponse[]>((resolve, reject) => {
        client.createTopics([
            {
                topic: name,
                partitions: 10,
                replicationFactor: 1,
                // configEntries: [
                //     {
                //         name: 'compression.type',
                //         value: 'gzip'
                //     }
                // ]
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

export async function refreshMetadata(client: KafkaClient, name: string) {
    return new Promise<void>((resolve, reject) => {
        client.refreshMetadata([name], error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

export async function loadMetadata(client: KafkaClient, name: string): Promise<MetadataResponse> {
    return new Promise<MetadataResponse>((resolve, reject) => {
        client.loadMetadataForTopics([name], async (error, result) => {
            if (error) 
                return reject(error);

            console.log(result);
            resolve(result);
        });
    });
}