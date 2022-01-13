# Versioning

This page details the versioning strategy and the rationale that supports it.

## Versioning strategy

⚠️ To be detailed, work in progress

- 2 digit version (`major.minor`)
  - `major` change means breaking change without backward compatibility
  - `minor` change otherwise

- **id & preferences**
  - all id & preferences objects include a `version` property with **full** `major.minor` version number

- **operator**
  - the major version is part of the endpoint path (ex: `/v2/id-prefs`)
  - no need to include it in **requests**, it would be redundant
  - **responses**  include a `version` property with **full** `major.minor` version number, for information

- **transmissions**
  - ⚠️ TO BE DETAILED: no version number in endpoint path, more tricky

## Breaking changes / backward compatibility

A **breaking change** happens in any of the following situations:
- the **type** of a field changes. In our case, it could be that **the algorithm used to calculate a signature** changes
- a new input field becomes mandatory
- an output field guaranteed to be returned is not systematically returned anymore

## Lifecycle

⚠️ To be detailed, work in progress

All modules of Prebid SSO are **versioned together**: whenever a new version is needed in one of the modules,
the version of all modules is incremented.

Pros:
- much simpler lifecycle, consistent versions
- avoid having to define compatibility matrix between modules

Cons:
- when a breaking change is introduced in one of the modules, all modules are considered incompatible with the previous version

## Rationale

### Context

Versioning is needed when producers and consumers of data or messages need to speak a common language to understand each other.

In our context, producers and consumers are quite diverse:

1. **id** objects are _created_ and _signed_ by operators
2. **preferences** objects are _created_ and _signed_ by CMPs or other contracting parties
    - this data (ids & preferences) is _stored_ as cookies on different domains (Prebid & other contracting parties) for varying periods
3. **messages** are _created_ and _signed_ by contracting parties and operators to communicate together
    - they include ids and preferences
4. **seeds** are _created_ and _signed_ by contracting parties to initiate RTB transactions
5. **transmissions** are _created_ and _signed_ by contracting parties to communicate together
    - they include ids and preferences
    - and seed

We assume that:
- when a contracting party communicates with an operator, it might be running a version of the **operator client** that is older or more recent than the **operator API**
- when contracting parties exchange transmissions, they might be running different versions of **the "transmission" library**
- when contracting parties exchange transmissions, they might be exchanging **id & preferences** and **seed** that have been created and signed
  with a version of the **data signing** library that is older or more recent than theirs

In other words, all the 5 points above could deserve their own specific versioning lifecycle:
- version of the data signing library that is used for creating id and preferences
- version of the API protocol that is used by operators and operator clients
- version of the data signing library that is used for creating seed
- version of the transmission protocol that is used by each of the nodes involved in the transaction

### Use cases

⚠️ To be detailed, work in progress: define what happens in the different use cases

- the algorithm to sign id & preferences needs to be updated
- the algorithm to sign requests to operator needs to be updated
- the algorithm to sign responses from operator needs to be updated
- the algorithm to sign seed needs to be updated
- the algorithm to sign a transmission needs to be updated

=> a solution could be to communicate the signature algorithm as part of the payload, instead of a version
(like JWT)
