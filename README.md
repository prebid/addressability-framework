
# 1. Introduction

## 1.1 Overview

The **Prebid Addressability Framework** (**PAF**) is a community-driven, open-source framework including founding principles, technical protocols, user experience requirements and contractual terms. It is designed to provide users with a consistent, transparent, low-friction experience while navigating across the open web. On marketers and publishers’ side, it makes responsible addressable marketing available for industry actors.

PAF sets up a random Identifier (ID) that is transparent to the User, and that is linked to user marketing preferences which can be changed at any moment and are not owned nor controlled by a single PAF actor. Preferences signal  User’s choice to either see personalized marketing and content (based on their behavior and interests) or standard marketing and content (that aren't linked to their behavior and interests).

## 1.2 Principles

PAF is built on four key principles:

-   **Secure and privacy friendly**: IDs automatically reset without user interaction every 6 months. Users can reset their ID at any time and on any PAF participating site. This ensures data minimization and is compliant with global privacy regulations.
    
-   **User transparency and control**: Users can easily view and manage and change their preferences on any site that uses this data. Users can also inquire on who received their data to show a specific ad, through available Audit Logs.
    
-   **Open-source and interoperable**: The framework is open-source and doesn’t provide any self-preferencing benefit to existing marketplace providers.
    
-   **Independently governed**: PAF actors incorporate the Model Terms into their general terms and ensure their use of data is available in an accountable Audit Log viewable by all actors.
    

These core principles keep user preferences at the center, while ensuring the AdTech industry implements a framework that allows all actors to continue to achieve their business goals seamlessly.


## 1.3 Benefits

**User Benefits**

-   Simpler navigation across the open web with less pop-ups
    
-   Ability to surf incognito (private browsing)
    
-   Free access to logs for auditing purposes
    
-   Continued access to a wider diversity of open web content and services
    

**Publisher Benefits**

-   Continued ability to choose which partners they work with to operate and grow their business
    
-   Improved monetization of their existing ad-funded pages
    
-   Better insight into which organizations are driving value thanks to generated Audit Logs
    

**Marketer Benefits**

-   Improved analytics and valuation across the open web
    
-   Better insight to investigate potential publisher fraud, thanks to Audit Logs

    

# 2. Organisations of PAF’s GitHub repository:

This repo is for documenting technical specifications. It contains:

-   The MVP technical specification folder: [MVP Specs](/mvp-spec)
    
-   An integration guide for all actors: [PAF-Integration-Guide.md](/Integration-guides/PAF-Integration-Guide.md)
    
-   The actual open-source code for MVP PAF implementation is hosted in another GitHub repo that is here: [PAF-implementation](https://github.com/prebid/paf-mvp-implementation)
    
-   A demo website with the PAF MVP implementation is currently available for all to see here: [https://www.pafdemopublisher.com/](https://www.pafdemopublisher.com/)

# 3. Components and roles as part of the Prebid Addressability Framework
| **Component<br>**                     	| **Description<br>**                                                                                 	| **Role / Functions<br>**                                                                                                                                                                                                                                                         	| **Example(s)<br>**                                                                                   	|
|---------------------------------------	|-----------------------------------------------------------------------------------------------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------	|
| **Website **                          	| A Publisher or Marketer Web Property.<br>                                                           	| Offers PAF choices to its users through a CMP component<br>Reads PAF IDs and Preferences from a PAF Operator of his choice<br>Generates ad or content using PAF IDs and Preferences through a digital supply chain<br>Provides the Audit Log to the user for such ads or content 	| A Publisher : <br>www.my-news-site.com<br>A Marketer :<br>www.brand-name.com                         	|
| **PAF Operator**                      	| A node participating to the decentralized management of PAF IDs and Preferences.                    	| Synchronizes PAF IDs and Preferences with other PAF Operators<br>Enables client Websites to read and set PAF IDs and Preferences                                                                                                                                                 	| An AdTech Partner:<br>crto.onekey.network<br>iponweb.onekey.network<br>a CMP Partner:<br>(see below) 	|
| **PAF Client Node**                   	| Software component handling all signing operations for a Website.                                   	| Secures authentication between the Website and its Operator<br>Authenticates the PAF transactions initiated by a Website                                                                                                                                                         	| a PAF Operator Partner:<br>(see above)<br>a CMP Partner:(see below)                                  	|
| **Consent Management Platform (CMP)** 	| Software Component used by a Website to present notice & choice for users. <br>                     	| Presents PAF choices (edit Preferences, reset IDs and/or stop using PAF) to the user in addition to any specific-site choice (e.g. direct payment)                                                                                                                               	| a CMP Partner:<br>SourcePoint<br>OneTrust …<br>or a self-operated solution                           	|
| **SSP, Ad Exchanges, DSPs**           	| Partners that are involved in the digital advertising or digital content supply chain of a Website. 	| Transmits PAF IDs and Preferences to their own partners<br>Generates ads and content using PAF IDs and Preferences<br>Appends signatures to the Audit Log                                                                                                                        	| Iponweb<br>OpenX<br>Criteo…                                                                          	|
|                                       	|                                                                                                     	|                                                                                                                                                                                                                                                                                  	|                                                                                                      	|

### Network DNS zone

In the current design, PAF Operator have the constraint to run services on subdomains of a common domain name. This is because the synchronization of PAF IDs and Preferences across PAF Operators relies on the cookie jar for the common domain.

To achieve this, each Operator is responsible for inserting the right information for the subdomain that they use in the network’s DNS zone.

For example for the `onekey.network` network, the `operator_a.onekey.network` is mapped to the DNS server of Operator A through a NS/SOA records.


## 4. The Role of the Model Terms

The framework includes a text document containing a set of legal clauses that any pair of organizations may include in the contract that binds them. Those are called “the Model Terms”.

For example:

-   an organization operating a Website may include the Model Terms in its contract with an organization that operates their CMP.
    
-   similarly, it may be included in the contract between a Website and its PAF Operator.
    
-   between a Website and their SSP.
    
-   between a SSP and an Ad Exchange, or between a SSP and a DSP etc.
    

The benefit of using the Model Terms is that it reinforces the compliance of both organizations to Data Protection regulation, and clarifies their respective liabilities in case of harm resulting from misprocessing of the user data.

It’s notable that the Model Terms requires that PAF IDs and Preferences that are sent from one party to another may only be further transferred to third parties with whom a contract including the Model Terms has also been signed.

When an organization decide to use the Model Terms in its contract, it guarantees that the PAF IDs and Preferences that they process and transfer can only be legally processed by other organization that are also bound to the same terms.

The goal of the technical part of the framework, which is further described in this documentation, is to facilitate the conformity of the organization operations to those terms.
