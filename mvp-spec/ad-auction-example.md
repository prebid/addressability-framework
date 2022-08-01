# Example of an ad auction

## Goal of the document

Provide a concrete example of an auction flow with Transmissions.

## The auction setup 

We use the following setup of Publisher, SSPs and DSPs and we describe the Transmission Requests and the Transmission Responses.

```mermaid
graph LR;
    PJS((Publisher<br />PrebidJS))-->|T1|SSP1
    PJS-->|T2|DSP1
    SSP1-->|T3|SSP2
    SSP1-->|T4|DSP2
    SSP2-->|T5|DSP3
```

Notes:

* We will consider that the publisher has two ad unit to offer a cross the Ad Network.
* Those ad units are associated respectively to one transaction_id each: `transaction-id-for-impression-1 (GUID)` (named TI1 in the auction flow) and `transaction-id-for-impression-2 (GUID)` (named TI2 in the auction flow).
* T1, T2... Tn are Transmission names to ease the discussion around it. T1 and T2 share only the seed to the Receivers and those Receivers send back a Transmission Response.
* This setup uses the PrebidJS on the Publisher website. The publisher generates the Seeds and pass it to PrebidJS which offer it to the PrebidJS adaptors. 

## The auction flow

```mermaid
sequenceDiagram;
    participant Publisher
    participant PJS
    participant SSP1
    participant SSP2
    participant DSP1
    participant DSP2
    participant DSP3

    Publisher->>Publisher: Generate Seed with Ids,<br /> Preferences and 2 TransactionIds
    Publisher->>PJS: Share Seed
    PJS->>SSP1: T1 Request without<br />source and parent
    activate PJS
    activate SSP1
    SSP1->>SSP2: T3 Request with T1 Result as parent
    activate SSP2    
    SSP2->>DSP3: T5 Request with T1 & T3 Results as parents
    DSP3->>SSP2: T5 Response without child with one bid for each TransactionId
    SSP2->>SSP1: T3 Response with T5 Result as child
    deactivate SSP2
    SSP1->>DSP2: T4 Request with T1 Result as parent
    DSP2->>SSP1: T4 Response without child with one bid for TI1
    SSP1->>PJS:  T1 Response with T3, T5<br />and T4 Results as children and one bid for TI2
    deactivate SSP1
    PJS->>DSP1:  T2 Request without parent
    DSP1->>PJS:  T2 Response without child and one bid for TI2
    deactivate PJS
    PJS->>PJS:  Selection of the winners:<br />DSP3 for TI1 and DSP1 for TI2
    PJS->>Publisher:  Share the winning transmission<br />response: T1 for TI1 and T2 for TI2
    Publisher->>Publisher: Generate audit logs for TI1 and TI2
```

## OpenRTB Request/Response with the Transmissions

In those examples:
* The transaction-ids, the content-ids, seat and signatures have defined value for easing the understanding of the relations between the requests and the responses. In real life, those values are GUID, integer or hash.
* The jsons omit some values (like "id" and "cur") that are normaly used in OpenRTB protocol to ease the understanding.
* T1 and T2 Request aren't embedded in a OpenRTB bid request, because those are typically sent by a Prebid.js Bidder Adapter to the bidder's server using a custom, non-OpenRTB message format.

<details>
<summary>Bid Requests in a custom format for T1 and T2 (identical)</summary>
    
The message sent to the bidder's server is typically in a custom format. The message should be modified as follows:       
1. Add the matching transaction id to each ad unit,
2. Add the OneKey id and preferences,
3. Add the seed.
    
In Prebid.js, using the onekey RTD module and the OneKey Id module will take care of doing those changes to the bidderRequest parameter that a bidder adapter receives.
The bidder adapter just needs to ensure the same additions are transferred to the server. Check the modules documentation for the detail of what the bidderRequest parameter will contain.

The examples below show:
- the changes to do on a fictive ad unit model,
- the recommended format to insert OneKey id and preferences in a custom bid request,
- the recommended format to insert the seed in a custom bid request.

<!--partial-begin { "files": [ "ad-auction-example-T1-T2-request-standalone.md" ] } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
Transaction ids:
```JSOn

"adunits": [
        {
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "paf_transaction_id": "transaction-id-for-impression-1 (GUID)"
        },
        {
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 1
            },
            "paf_transaction_id": "transaction-id-for-impression-2 (GUID)"
        }
    ]
```

Ids and preferences:
```JSON

"PAF_identifiers": {
                    "version": "0.1",
                    "type": "paf_browser_id",
                    "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                    "source": {
                        "domain": "operator0.com",
                        "timestamp": 1639580000,
                        "signature": "operator-signature-done-before-ad-auction-flow"
                        }
                    }
"PAF_preferences": {
                    "version": "0.1",
                    "data": { 
                        "use_browsing_for_personalization": true 
                    },
                    "source": {
                        "domain": "cmp1.com",
                        "timestamp": 1639581000,
                        "signature": "cmp-signature-done-before-ad-auction-flow"
                }
}
```
The seed:
```JSON

"seed": {
            "version": "0.1",
            "transaction_ids": [ 
                "transaction-id-for-impression-1 (GUID)", 
                "transaction-id-for-impression-2 (GUID)" 
            ],
            "publisher": "publisher.com",
            "source": {
                "domain": "publisher.com",
                "timestamp": 1639582000,
                "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
            }
        }
        
```
<!--partial-end-->   
    
</details>

<details>
<summary>OpenRTB Bid Requests with T3 and T4 (identical)</summary>

T3 and T4 are within OpenRTB Bid Requests. Therefore, the format of OpenRTB is used here.
The Sender, SSP1, generates its Transmission Result with a signature and adds it to the `parents` object.

<!--partial-begin { "files": [ "ad-auction-example-T3-T4-request.md" ]} -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```JSON
{
    "imp": [
        {
            "id": "1",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-1"
                    }
                }
            }
        },
        {
            "id": "2",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 1
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-2"
                    }
                }
            }
        }
    ],
    "user": {
        "id": "55816b39711f9b5acf3b90e313ed29e51665623f",
         "ext":
         {
            "eids": 
            [
                {
                    "source": "paf",
                    "uids": [
                        {
                            "source": "paf",
                            "atype": 1,
                            "id": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                            "ext": 
                            {
                                "version": "0.1",
                                "type": "paf_browser_id",
                                "source": {
                                    "domain": "operator0.com",
                                    "timestamp": 1639580000,
                                    "signature": "operator-signature-done-before-ad-auction-flow"
                                }
                            }
                        }
                    ],
                    "ext": {
                        "preferences": {
                            "version": "0.1",
                            "data": { 
                                "use_browsing_for_personalization": true 
                            },
                            "source": {
                                "domain": "cmp1.com",
                                "timestamp": 1639581000,
                                "signature": "cmp-signature-done-before-ad-auction-flow"
                            }
                        }
                    }
                }
            ],
            "paf": {
                "transmission": {
                    "seed": {
                        "version": "0.1",
                        "transaction_ids": [ 
                            "transaction-id-for-impression-1 (GUID)", 
                            "transaction-id-for-impression-2 (GUID)" 
                        ],
                        "publisher": "publisher.com",
                        "source": {
                            "domain": "publisher.com",
                            "timestamp": 1639582000,
                            "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
                        }
                    },
                    "parents": [
                        {
                            "version": "0.1",
                            "receiver": "ssp1.com",
                            "contents": [],
                            "status": "success",
                            "details": "",
                            "source": {
                                "domain": "ssp1.com",
                                "timestamp": 1639581000,
                                "signature": "transmission-signature-done-by-ssp1-just-after-T1-request"
                            }
                        }
                    ]
                }
            }
        }
    }
}
```
<!--partial-end-->
</details>

<details>
<summary>OpenRTB Bid Request with T5</summary>


T5 is within an OpenRTB Bid Request and respects its protocol.
The Sender, SSP2, generates its Transmission Result with a signature and adds it to the `parents` object which contains already the Transmission Result of T1.

<!--partial-begin { "files": [ "ad-auction-example-T5-request.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "imp": [
        {
            "id": "1",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-1 (GUID)"
                    }
                }
            }
        },
        {
            "id": "2",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 1
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-2 (GUID)"
                    }
                }
            }
        }
    ],
    "user": {
        "id": "55816b39711f9b5acf3b90e313ed29e51665623f",
         "ext":
         {
            "eids": 
            [
                {
                    "source": "paf",
                    "uids": [
                        {
                            "source": "paf",
                            "atype": 1,
                            "id": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                            "ext": 
                            {
                                "version": "0.1",
                                "type": "paf_browser_id",
                                "source": {
                                    "domain": "operator0.com",
                                    "timestamp": 1639580000,
                                    "signature": "operator-signature-done-before-ad-auction-flow"
                                }
                            }
                        }
                    ],
                    "ext": {
                        "preferences": {
                            "version": "0.1",
                            "data": { 
                                "use_browsing_for_personalization": true 
                            },
                            "source": {
                                "domain": "cmp1.com",
                                "timestamp": 1639581000,
                                "signature": "cmp-signature-done-before-ad-auction-flow"
                            }
                        }
                    }
                }
            ],
            "paf": {
                "transmission": {
                    "seed": {
                        "version": "0.1",
                        "transaction_ids": [ 
                            "transaction-id-for-impression-1", 
                            "transaction-id-for-impression-2"
                        ],
                        "publisher": "publisher.com",
                        "source": {
                            "domain": "publisher.com",
                            "timestamp": 1639582000,
                            "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
                        }
                    },
                    "parents": [
                        {
                            "version": "0.1",
                            "receiver": "ssp1.com",
                            "contents": [],
                            "status": "success",
                            "details": "",
                            "source": {
                                "domain": "ssp1.com",
                                "timestamp": 1639581000,
                                "signature": "transmission-signature-done-by-ssp1-just-after-T1-request"
                            }
                        },
                        {
                            "version": "0.1",
                            "receiver": "ssp2.com",
                            "contents": [],
                            "status": "success",
                            "details": "",
                            "source": {
                                "domain": "ssp2.com",
                                "timestamp": 1639581000,
                                "signature": "transmission-signature-done-by-ssp2-just-after-T3-request"
                            }
                        }
                    ]
                }
            }
        }
    }
}
```
<!--partial-end-->
</details>

<details>
<summary>OpenRTB Bid Response with T4</summary>

<!--partial-begin { "files": [ "ad-auction-example-T4-response.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "ext": {
        "paf": {
            "transmission": {
                "version": "0.1",
                "contents": [
                    {
                        "transaction_id": "transaction-id-for-impression-1 (GUID)",
                        "content_id": "dsp2-content-id-for-impression-1 (GUID)"
                    }
                ],
                "status": "success",
                "details": "",
                "receiver": "dsp2.com",
                "source": {
                    "domain": "dsp2.com",
                    "timestamp": 1639589531,
                    "signature": "transmission-signature-done-by-dsp2-just-after-T4-request"
                },
                "children": [
                ]
            }
        }
    },
    "seatbid": [
        {
            "seat": "513 (DSP2)",
            "bid": [
                {
                    "id": "1",
                    "impid": "1",
                    "price": 1,
                    "nurl": "http://adserver2.com/winnotice?impid=102",
                    "iurl": "http://adserver2.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain2.com" ],
                    "cid": "campaign2",
                    "crid": "creative2",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp2-content-id-for-impression-1 (GUID)"
                        }
                    }
                }
            ]
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>OpenRTB Bid Response with T5</summary>

<!--partial-begin { "files": [ "ad-auction-example-T5-response.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "ext": {
        "paf": {
            "transmission": {
                "version": "0.1",
                "contents": [
                    {
                        "transaction_id": "transaction-id-for-impression-1 (GUID)",
                        "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                    },
                    {
                        "transaction_id": "transaction-id-for-impression-2 (GUID)",
                        "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                    }
                ],
                "status": "success",
                "details": "",
                "receiver": "dsp3.com",
                "source": {
                    "domain": "dsp3.com",
                    "timestamp": 1639589531,
                    "signature": "transmission-signature-done-by-dsp3-just-after-T5-request"
                },
                "children": [
                ]
            }
        }
    },
    "seatbid": [
        {
            "seat": "512 (DSP3)",
            "bid": [
                {
                    "id": "1",
                    "impid": "1",
                    "price": 6,
                    "nurl": "http://adserver31.com/winnotice?impid=102",
                    "iurl": "http://adserver31.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain31.com" ],
                    "cid": "campaign31",
                    "crid": "creative31",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                        }
                    }
                },
                {
                    "id": "2",
                    "impid": "2",
                    "price": 2,
                    "nurl": "http://adserver32.com/winnotice?impid=102",
                    "iurl": "http://adserver32.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain32.com" ],
                    "cid": "campaign32",
                    "crid": "creative32",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                        }
                    }
                }
            ]
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>OpenRTB Bid Response with T3</summary>

<!--partial-begin { "files": [ "ad-auction-example-T3-response.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "ext": {
        "paf": {
            "transmission": {
                "version": "0.1",
                "contents": [
                ],
                "status": "success",
                "details": "",
                "receiver": "ssp2.com",
                "source": {
                    "domain": "ssp2.com",
                    "timestamp": 1639589531,
                    "signature": "asfdef14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019dssda"
                },
                "children": [
                    {
                        "version": "0.1",
                        "contents": [
                            {
                                "transaction_id": "transaction-id-for-impression-1 (GUID)",
                                "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                            },
                            {
                                "transaction_id": "transaction-id-for-impression-2 (GUID)",
                                "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                            }
                        ],
                        "status": "success",
                        "details": "",
                        "receiver": "dsp3.com",
                        "source": {
                            "domain": "dsp3.com",
                            "timestamp": 1639589531,
                            "signature": "transmission-signature-done-by-dsp3-just-after-T5-request"
                        },
                        "children": [
                        ]
                    }
                ]
            }
        }
    },
    "seatbid": [
        {
            "seat": "512 (DSP3)",
            "bid": [
                {
                    "id": "1",
                    "impid": "1",
                    "price": 6,
                    "nurl": "http://adserver31.com/winnotice?impid=102",
                    "iurl": "http://adserver31.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain31.com" ],
                    "cid": "campaign31",
                    "crid": "creative31",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                        }
                    }
                },
                {
                    "id": "2",
                    "impid": "2",
                    "price": 2,
                    "nurl": "http://adserver32.com/winnotice?impid=102",
                    "iurl": "http://adserver32.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain32.com" ],
                    "cid": "campaign32",
                    "crid": "creative32",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                        }
                    }
                }
            ]
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>Bid Response with standalone format for T1</summary>

<!--partial-begin { "files": [ "ad-auction-example-T1-response-standalone.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "paf_transmission": {
        "version": "0.1",
        "contents": [
        ],
        "status": "success",
        "details": "",
        "receiver": "ssp1.com",
        "source": {
            "domain": "ssp1.com",
            "timestamp": 1639589531,
            "signature": "transmission-signature-done-by-ssp1-just-after-T1-request"
        },
        "children": [
            {
                "version": "0.1",
                "contents": [
                ],
                "status": "success",
                "details": "",
                "receiver": "ssp2.com",
                "source": {
                    "domain": "ssp2.com",
                    "timestamp": 1639589531,
                    "signature": "transmission-signature-done-by-ssp2-just-after-T3-request"
                },
                "children": [
                    {
                        "version": "0.1",
                        "contents": [
                            {
                                "transaction_id": "transaction-id-for-impression-1 (GUID)",
                                "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                            },
                            {
                                "transaction_id": "transaction-id-for-impression-2 (GUID)",
                                "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                            }
                        ],
                        "status": "success",
                        "details": "",
                        "receiver": "dsp3.com",
                        "source": {
                            "domain": "dsp3.com",
                            "timestamp": 1639589531,
                            "signature": "transmission-signature-done-by-dsp3-just-after-T5-request"
                        },
                        "children": [
                        ]
                    }
                ]
            },
            {
                "version": "0.1",
                "contents": [
                    {
                        "transaction_id": "transaction-id-for-impression-1 (GUID)",
                        "content_id": "dsp2-content-id-for-impression-1 (GUID)"
                    }
                ],
                "status": "success",
                "details": "",
                "receiver": "dsp2.com",
                "source": {
                    "domain": "dsp2.com",
                    "timestamp": 1639589531,
                    "signature": "transmission-signature-done-by-dsp2-just-after-T4-request"
                },
                "children": [
                ]
            }
        ]
    },
    "bid": [
        {
            "impid": "1",
            "price": 6,
            "nurl": "http://adserver31.com/winnotice?impid=102",
            "iurl": "http://adserver31.com/pathtosampleimage",
            "adomain": [ "advertiserdomain31.com" ],
            "cid": "campaign31",
            "crid": "creative31",
            "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
            "paf_content_id": "dsp3-content-id-for-impression-1 (GUID)"
        },
        {
            "impid": "2",
            "price": 2,
            "nurl": "http://adserver32.com/winnotice?impid=102",
            "iurl": "http://adserver32.com/pathtosampleimage",
            "adomain": [ "advertiserdomain32.com" ],
            "cid": "campaign32",
            "crid": "creative32",
            "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
            "paf_content_id": "dsp3-content-id-for-impression-2 (GUID)"
        },
        {
            "impid": "1",
            "price": 1,
            "nurl": "http://adserver2.com/winnotice?impid=102",
            "iurl": "http://adserver2.com/pathtosampleimage",
            "adomain": [ "advertiserdomain2.com" ],
            "cid": "campaign2",
            "crid": "creative2",
            "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
            "paf_content_id": "dsp2-content-id-for-impression-1 (GUID)"
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>Bid Response with standalone format for T2</summary>

<!--partial-begin { "files": [ "ad-auction-example-T2-response-standalone.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "paf_transmission": {
        "version": "0.1",
        "contents": [
            {
                "transaction_id": "transaction-id-for-impression-2 (GUID)",
                "content_id": "dsp1-content-id-for-impression-2 (GUID)"
            }
        ],
        "status": "success",
        "details": "",
        "receiver": "dsp1.com",
        "source": {
            "domain": "dsp1.com",
            "timestamp": 1639589531,
            "signature": "transmission-signature-done-by-dsp1-just-after-T2-request"
        },
        "children": [
        ]
    },
    "seatbid": [
        {
            "seat": "555 (DSP1)",
            "bid": [
                {
                    "id": "2",
                    "impid": "2",
                    "price": 5,
                    "nurl": "http://adserver12.com/winnotice?impid=102",
                    "iurl": "http://adserver12.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain12.com" ],
                    "cid": "campaign12",
                    "crid": "creative12",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "dsp1-content-id-for-impression-2 (GUID)"
                        }
                    }
                }
            ]
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>Audit Log for TI1 based on T1</summary>
PrebidJS has selected DSP3 as a winner. Therefore, it uses all the Transmissions that was in the path between the publisher and DSP3. The Audit Log is created accordingly with only T1, T3 and T5.

```mermaid
graph LR;
    PJS((Publisher<br />PrebidJS))-->|T1|SSP1
    SSP1-->|T3|SSP2
    SSP2-->|T5|DSP3
```


<!--partial-begin { "files": [ "ad-auction-example-TI1-audit-log.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "data": {
        "identifiers": [
            {
                "version": "0.1",
                "type": "paf_browser_id",
                "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                "source": {
                    "domain": "operator0.com",
                    "timestamp": 1639589531,
                    "signature": "operator-signature-done-before-ad-auction-flow"
                }
            }
        ],
        "preferences": {
            "version": "0.1",
            "data": { 
                "use_browsing_for_personalization": true 
            },
            "source": {
                "domain": "cmp1.com",
                "timestamp": 1639589531,
                "signature": "cmp-signature-done-before-ad-auction-flow"
            }
        }
    },
    "seed": {
        "version": "0.1",
        "transaction_ids": [ 
            "transaction-id-for-impression-1 (GUID)", 
            "transaction-id-for-impression-2 (GUID)" 
        ],
        "publisher": "publisher.com",
        "source": {
            "domain": "publisher.com",
            "timestamp": 1639582000,
            "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
        }
    },
    "transaction_id": "transaction-id-for-impression-1 (GUID)",
    "transmissions": [
        {
            "version": "0.1",
            "contents": [
            ],
            "status": "success",
            "details": "",
            "receiver": "ssp1.com",
            "source": {
                "domain": "ssp1.com",
                "timestamp": 1639589531,
                "signature": "transmission-signature-done-by-ssp1-just-after-T1-request"
            }
        },
        {
            "version": "0.1",
            "contents": [
            ],
            "status": "success",
            "details": "",
            "receiver": "ssp2.com",
            "source": {
                "domain": "ssp2.com",
                "timestamp": 1639589531,
                "signature": "transmission-signature-done-by-ssp2-just-after-T3-request"
            }
        },
        {
            "version": "0.1",
            "contents": [
                {
                    "transaction_id": "transaction-id-for-impression-1 (GUID)",
                    "content_id": "dsp3-content-id-for-impression-1 (GUID)"
                },
                {
                    "transaction_id": "transaction-id-for-impression-2 (GUID)",
                    "content_id": "dsp3-content-id-for-impression-2 (GUID)"
                }
            ],
            "status": "success",
            "details": "",
            "receiver": "dsp3.com",
            "source": {
                "domain": "dsp3.com",
                "timestamp": 1639589531,
                "signature": "transmission-signature-done-by-dsp3-just-after-T5-request"
            }
        }
    ]
}
```
<!--partial-end-->
</details>

<details>
<summary>Audit Log for TI2 based on T2</summary>

For the second Ad Unit, PrebidJs as selected DSP1 as a winner. Here there is only one Transmission between the Publisher and DSP1. The Audit Log is created accordingly with only T2. 

```mermaid
graph LR;
    PJS((Publisher<br />PrebidJS))-->|T2|DSP1
```

<!--partial-begin { "files": [ "ad-auction-example-TI2-audit-log.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "data": {
        "identifiers": [
            {
                "version": "0.1",
                "type": "paf_browser_id",
                "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                "source": {
                    "domain": "operator0.com",
                    "timestamp": 1639589531,
                    "signature": "operator-signature-done-before-ad-auction-flow"
                }
            }
        ],
        "preferences": {
            "version": "0.1",
            "data": { 
                "use_browsing_for_personalization": true 
            },
            "source": {
                "domain": "cmp1.com",
                "timestamp": 1639589531,
                "signature": "cmp-signature-done-before-ad-auction-flow"
            }
        }
    },
    "seed": {
        "version": "0.1",
        "transaction_ids": [ 
            "transaction-id-for-impression-1", 
            "transaction-id-for-impression-2" 
        ],
        "publisher": "publisher.com",
        "source": {
            "domain": "publisher.com",
            "timestamp": 1639582000,
            "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
        }
    },
    "transaction_id": "transaction-id-for-impression-2 (GUID)",
    "transmissions": [
        {
            "version": "0.1",
            "contents": [
                {
                    "transaction_id": "transaction-id-for-impression-2 (GUID)",
                    "content_id": "dsp1-content-id-for-impression-2 (GUID)"
                }
            ],
            "status": "success",
            "details": "",
            "receiver": "dsp1.com",
            "source": {
                "domain": "dsp1.com",
                "timestamp": 1639589531,
                "signature": "transmission-signature-done-by-dsp1-just-after-T2-request"
            }
        }
    ]
}
```
<!--partial-end-->
</details>

## Signatures

In this section, we will focus on the signature to explain what exactly is signed at which moment. It is an example and based on [security-signatures.md](security-signatures.md)

1. operator-signature-done-before-ad-auction-flow

    Signed by the operator when the id was created.
    The signature inputs are described in [identifier.md](./model/identifier.md), in the source section, as for all .

2. cmp-signature-done-before-ad-auction-flow

    Signed by the CMP when collecting the user preferences. 
    The inputs are described in [preferences.md](./model/preferences.md)

3. seed-signature-done-by-publisher-before-T1-and-T2

    Signed by the publisher when initiating the bid request and getting the seed.

Inputs are described here [seed.md](./model/seed.md)

4. transmission-signature-done-by-ssp1-just-after-T1-request

    Signed by SSP1 when receiving the seed from the publisher.

    Inputs for this and the following transmissions are described here. [transmission-request](./model/transmission-request.md). 

    It is important to note that at this step, contents are empty and that therefore transaction ids are only signed via the seeds (not the content) and there are no content id (as it will be created by DSP).

    This signature is also added in the bid response, and not recomputed at the response stage.

5. transmission-signature-done-by-dsp1-just-after-T2-request
    
    This is signed by DSP 1 after receiving T2 request and deciding the contents (and there ids) he wanted to send back.
    
    Inputs for this signature are describe here [transmission-response](./model/transmission-response.md).
    
    For this signature, the contents are available and are therefore signed.

6. transmission-signature-done-by-ssp2-just-after-T3-request

    Signed by SSP2. As for signature 4. 'transmission-signature-done-by-ssp1-just-after-T1-request', it is then reused at the response stage and does not sign content (as it is empty).


7. transmission-signature-done-by-dsp2-just-after-T4-request

    As for signature 5, this signature also sign content created by DSP2.


8. transmission-signature-done-by-dsp3-just-after-T5-request

    As for signature 5 & 7, this signature also sign content created by DSP3.

