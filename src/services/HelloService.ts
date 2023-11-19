import { createChannel, createClient, Client } from 'nice-grpc';
import { HelloServiceDefinition } from '../proto/services/hello/v1/hello_service';

export const getHelloService = () => {
  const channel = createChannel('localhost:4000');
  const client: Client<typeof HelloServiceDefinition> = createClient(
    HelloServiceDefinition,
    channel
  );
  return client;
};
