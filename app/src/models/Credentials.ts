export interface AwsCredentials {
  accessKey:string;
  secretKey:string;
}

export interface Credentials {
  aws:AwsCredentials;
}
