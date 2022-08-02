# Client Node Admin Guide

A Client Node Service is provided by Criteo.
This guide explain how to host an independent Client Node.

## Deploying the Client Node Service

A Client Node implementation in NodeJS is available [here](https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-client-express).

It can be deployed on any hosting service of your choice.

## Configuring a Client Node for a specific website

The Website owner must choose a subdomain for accessing the Client Node.
As provider, you must provide the IP address or domain name ALIAS that the Website Owner must set up in his DNS zone.

The Website Owner must then provide:
- The chosen subdomain
- Their Legal Name   
- Their DPO email address
- Their Privacy page URL
- The hostname of the Operator he wishes to use

Admin actions:
- Configure the server to accept connections on the vhost of the subdomain (e.g. `client-node.example-website.com`)
- Generate and configure the pair of **cryptographic keys** for the website
    -   This can be done with openssl binaries:
        -   private key: `openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem`  
        -   public key: `openssl ec -in private-key.pem -pubout -out public-key.pem`
- Decide the **expiration date** for this private / public keys pair
- Configure this new service instance using the above information:
```javascript
    addClientNodeEndpoints(
      express(),
      // Information to identify the participant to the users, to the operator and to other participants
      {
        // Name of the participant
        name: 'Example Website',
        // Current public key
        currentPublicKey: {
          // Validity period for the key
          // Timestamps are expressed in seconds
          startTimestampInSec: getTimeStampInSec(new Date('2022-01-01T12:00:00.000Z')),
          endTimestampInSec: getTimeStampInSec(new Date('2022-12-31T12:00:00.000Z')),
          publicKey: `-----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEl0278pcupaxUfiqHJ9AG9gVMyIO+
    n07PJaNI22v+s7hR1Hkb71De6Ot5Z4JLoZ7aj1xYhFcQJsYkFlXxcBWfRQ==
    -----END PUBLIC KEY-----`,
        },
        // Email address of DPO
        dpoEmailAddress: 'dpo@example-website.com',
        // URL of a privacy page
        privacyPolicyUrl: new URL('https://www.example-website/privacy'),
      },
      {
        // The Client Node host name to receive requests
        hostName: 'client-node.example-website.com',
        // Current private key
        privateKey: `-----BEGIN PRIVATE KEY-----
    MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0X8r0PYAm3mq206o
    CdMHwZ948ONyVJToeFbLqBDKi7OhRANCAASXTbvyly6lrFR+Kocn0Ab2BUzIg76f
    Ts8lo0jba/6zuFHUeRvvUN7o63lngkuhntqPXFiEVxAmxiQWVfFwFZ9F
    -----END PRIVATE KEY-----`,
      },
      // The Operator host
      'example.onekey.network'
    );
```
