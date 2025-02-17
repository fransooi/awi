declare const TextAiDetectionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly provider_params: {
                readonly type: "string";
                readonly description: "\nParameters specific to the provider that you want to send along the request.\n\nit should take a *provider* name as key and an object of parameters as value.\n\nExample:\n\n    {\n      \"deepgram\": {\n        \"filler_words\": true,\n        \"smart_format\": true,\n        \"callback\": \"https://webhook.site/0000\"\n      },\n      \"assembly\": {\n        \"webhook_url\": \"https://webhook.site/0000\"\n      }\n    }\n\nPlease refer to the documentation of each provider to see which parameters to send.\n";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["The panther, also known as the black panther, is a magnificent and enigmatic creature that captivates the imagination of many. It is not a distinct species itself, but rather a melanistic variant of leopards and jaguars. The mesmerizing black coat of the panther is a result of a genetic mutation that increases the production of dark pigment, melanin.         Panthers are highly adaptable predators, found primarily in dense forests and jungles across Africa, Asia, and the Americas. Their stealthy nature and exceptional agility make them formidable hunters. They are solitary creatures, preferring to roam alone in their vast territories, which can span over a hundred square miles.         Equipped with incredible strength and sharp retractable claws, panthers are skilled climbers and swimmers. Their keen senses, including sharp vision and acute hearing, aid them in locating prey, often stalking their victims from the cover of trees or thick underbrush before launching a precise and powerful attack.         The diet of a panther consists mainly of deer, wild boar, and smaller mammals. However, they are opportunistic hunters and can also target livestock and domestic animals in areas where their habitats overlap with human settlements. Unfortunately, this sometimes leads to conflicts with humans, resulting in the panther being perceived as a threat.         Despite their association with darkness and mystery, panthers play a vital role in maintaining the balance of ecosystems. As apex predators, they help control populations of herbivores, preventing overgrazing and maintaining healthy prey dynamics.         Conservation efforts are crucial to the survival of panther populations worldwide. Habitat loss, poaching, and illegal wildlife trade pose significant threats to their existence. Various organizations and governments are working tirelessly to protect these magnificent creatures through initiatives such as establishing protected areas, promoting sustainable land use practices, and raising awareness about their importance in the natural world."];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly winstonai: {
                    readonly required: readonly ["ai_score", "status"];
                    readonly title: "textai_detectionAiDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly ai_score: {
                            readonly title: "Ai Score";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text", "prediction", "ai_score", "ai_score_detail"];
                                readonly title: "AiDetectionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly prediction: {
                                        readonly title: "Prediction";
                                        readonly type: "string";
                                    };
                                    readonly ai_score: {
                                        readonly title: "Ai Score";
                                        readonly type: "integer";
                                    };
                                    readonly ai_score_detail: {
                                        readonly title: "Ai Score Detail";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly sapling: {
                    readonly required: readonly ["ai_score", "status"];
                    readonly title: "textai_detectionAiDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly ai_score: {
                            readonly title: "Ai Score";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text", "prediction", "ai_score", "ai_score_detail"];
                                readonly title: "AiDetectionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly prediction: {
                                        readonly title: "Prediction";
                                        readonly type: "string";
                                    };
                                    readonly ai_score: {
                                        readonly title: "Ai Score";
                                        readonly type: "integer";
                                    };
                                    readonly ai_score_detail: {
                                        readonly title: "Ai Score Detail";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly originalityai: {
                    readonly required: readonly ["ai_score", "status"];
                    readonly title: "textai_detectionAiDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly ai_score: {
                            readonly title: "Ai Score";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text", "prediction", "ai_score", "ai_score_detail"];
                                readonly title: "AiDetectionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly prediction: {
                                        readonly title: "Prediction";
                                        readonly type: "string";
                                    };
                                    readonly ai_score: {
                                        readonly title: "Ai Score";
                                        readonly type: "integer";
                                    };
                                    readonly ai_score_detail: {
                                        readonly title: "Ai Score Detail";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textai_detectionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextAnonymizationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Overall I am satisfied with my experience at Amazon, but two areas of major improvement needed. First is the product reviews and pricing. There are thousands of positive reviews for so many items, and it's clear that the reviews are bogus or not really associated with that product. There needs to be a way to only view products sold by Amazon directly, because many market sellers way overprice items that can be purchased cheaper elsewhere (like Walmart, Target, etc). The second issue is they make it too difficult to get help when there's an issue with an order."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly openai: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly emvista: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly oneai: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly privateai: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textanonymizationAnonymizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly entities: {
                            readonly title: "Entities";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This model represents an entity extracted from the text.\n\nAttributes:\n    offset (int): The offset of the entity in the text.\n    length (int): The lenght of the entity in the text.\n    category (CategoryType): The category of the entity.\n    subcategory (SubCategoryType): The subcategory of the entity.\n    original_label (str): The original label of the entity.\n    content (str): The content of the entity.";
                                readonly required: readonly ["offset", "length", "category", "subcategory", "original_label", "content", "confidence_score"];
                                readonly title: "AnonymizationEntity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly exclusiveMinimum: true;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["CreditCard", "CardExpiry", "BankAccountNumber", "BankRoutingNumber", "SwiftCode", "TaxIdentificationNumber"];
                                            readonly title: "FinancialInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CreditCard` `CardExpiry` `BankAccountNumber` `BankRoutingNumber` `SwiftCode` `TaxIdentificationNumber`";
                                        }, {
                                            readonly enum: readonly ["Name", "Age", "Email", "Phone", "PersonType", "Gender"];
                                            readonly title: "PersonalInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Name` `Age` `Email` `Phone` `PersonType` `Gender`";
                                        }, {
                                            readonly enum: readonly ["SocialSecurityNumber", "NationalIdentificationNumber", "NationalHealthService", "ResidentRegistrationNumber", "DriverLicenseNumber", "PassportNumber"];
                                            readonly title: "IdentificationNumbersSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SocialSecurityNumber` `NationalIdentificationNumber` `NationalHealthService` `ResidentRegistrationNumber` `DriverLicenseNumber` `PassportNumber`";
                                        }, {
                                            readonly enum: readonly ["URL", "IP", "MAC", "VehicleIdentificationNumber", "LicensePlate", "VoterNumber", "AWSKeys", "AzureKeys", "Password"];
                                            readonly title: "MiscellaneousSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`URL` `IP` `MAC` `VehicleIdentificationNumber` `LicensePlate` `VoterNumber` `AWSKeys` `AzureKeys` `Password`";
                                        }, {
                                            readonly enum: readonly ["CompanyName", "CompanyNumber", "BuisnessNumber"];
                                            readonly title: "OrganizationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`CompanyName` `CompanyNumber` `BuisnessNumber`";
                                        }, {
                                            readonly enum: readonly ["Date", "Time", "DateTime", "Duration"];
                                            readonly title: "DateAndTimeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Date` `Time` `DateTime` `Duration`";
                                        }, {
                                            readonly enum: readonly ["Address", "Location"];
                                            readonly title: "LocationInformationSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Address` `Location`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly original_label: {
                                        readonly minLength: 1;
                                        readonly title: "Original Label";
                                        readonly type: "string";
                                    };
                                    readonly content: {
                                        readonly minLength: 1;
                                        readonly title: "Content";
                                        readonly type: "string";
                                    };
                                    readonly confidence_score: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Confidence Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textanonymizationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextChatCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: readonly ["string", "null"];
                readonly description: "Start your conversation here...";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly chatbot_global_action: {
                readonly type: readonly ["string", "null"];
                readonly description: "A system message that helps set the behavior of the assistant. For example, 'You are a helpful assistant'.";
                readonly examples: readonly ["You are a keyword extractor. Extract Only the word from the text provided."];
            };
            readonly previous_history: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly role: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly examples: readonly ["user"];
                        };
                        readonly message: {};
                        readonly tools: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly description: "The name of your tool/function";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                    };
                                    readonly parameters: {
                                        readonly description: "The tool's parameters are specified using a JSON Schema object. Detailed format documentation is available in the [JSON Schema reference](https://json-schema.org/understanding-json-schema/).\n\n**Make sure to well describe each parameter for best results.**\n\n\nExample for a weather tool:\n\n    {\n      \"type\": \"object\",\n      \"properties\": {\n        \"location\": {\n          \"type\": \"string\"\n          \"description\": \"The geographical location for which weather data is requested.\"\n        },\n        \"unit\": {\n          \"type\": \"string\", \"enum\": [\"Celsius\", \"Fahrenheit\"]\n          \"description\": \"The unit of measurement for temperature.\"\n        }\n      },\n      \"required\": [\"location\"]\n    }\n    ";
                                    };
                                };
                                readonly required: readonly ["description", "name", "parameters"];
                            };
                        };
                        readonly tool_calls: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly arguments: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                };
                                readonly required: readonly ["arguments", "id", "name"];
                            };
                        };
                    };
                    readonly required: readonly ["message", "role"];
                };
                readonly description: "A list containing all the previous conversations between the user and the chatbot AI. Each item in the list should be a dictionary with two keys: 'role' and 'message'. The 'role' key specifies the role of the speaker and can have the values 'user' or 'assistant'. The 'message' key contains the text of the conversation from the respective role. For example: [{'role': 'user', 'message': 'Hello'}, {'role': 'assistant', 'message': 'Hi, how can I help you?'}, ...]. This format allows easy identification of the speaker's role and their corresponding message.";
            };
            readonly temperature: {
                readonly type: "number";
                readonly format: "double";
                readonly maximum: 2;
                readonly minimum: 0;
                readonly default: 0;
                readonly description: "Higher values mean the model will take more risks and value 0 (argmax sampling) works better for scenarios with a well-defined answer.";
            };
            readonly max_tokens: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly default: 1000;
                readonly description: "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.";
                readonly examples: readonly [100];
            };
            readonly tool_choice: {
                readonly default: "auto";
                readonly description: "* `auto` - auto\n* `required` - required\n* `none` - none\n\nDefault: `auto`";
                readonly enum: readonly ["auto", "required", "none"];
                readonly type: "string";
            };
            readonly available_tools: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "The name of your tool/function";
                        };
                        readonly description: {
                            readonly type: "string";
                        };
                        readonly parameters: {
                            readonly description: "The tool's parameters are specified using a JSON Schema object. Detailed format documentation is available in the [JSON Schema reference](https://json-schema.org/understanding-json-schema/).\n\n**Make sure to well describe each parameter for best results.**\n\n\nExample for a weather tool:\n\n    {\n      \"type\": \"object\",\n      \"properties\": {\n        \"location\": {\n          \"type\": \"string\"\n          \"description\": \"The geographical location for which weather data is requested.\"\n        },\n        \"unit\": {\n          \"type\": \"string\", \"enum\": [\"Celsius\", \"Fahrenheit\"]\n          \"description\": \"The unit of measurement for temperature.\"\n        }\n      },\n      \"required\": [\"location\"]\n    }\n    ";
                        };
                    };
                    readonly required: readonly ["description", "name", "parameters"];
                };
                readonly description: "A list of tools the model may generate the right arguments for.";
            };
            readonly tool_results: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "the id of the `tool_call` used to generate result";
                        };
                        readonly result: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "the result of your function";
                        };
                    };
                    readonly required: readonly ["id", "result"];
                };
                readonly description: "List of results obtained from applying the tool_call arguments to your own tool.";
            };
        };
        readonly required: readonly ["providers"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly cohere: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly replicate: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly anthropic: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly perplexityai: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly meta: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly mistral: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textchatChatDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly title: "Message";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["role"];
                                readonly title: "ChatMessageDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                    };
                                    readonly message: {
                                        readonly title: "Message";
                                        readonly type: "string";
                                    };
                                    readonly tools: {
                                        readonly default: any;
                                        readonly description: "Tools defined by the user";
                                        readonly title: "Tools";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly additionalProperties: true;
                                        };
                                    };
                                    readonly tool_calls: {
                                        readonly default: any;
                                        readonly description: "The tools arguments generated from tools definition and user prompt.";
                                        readonly title: "Tool Calls";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["id", "name", "arguments"];
                                            readonly title: "ToolCall";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly title: "Id";
                                                    readonly type: "string";
                                                };
                                                readonly name: {
                                                    readonly title: "Name";
                                                    readonly type: "string";
                                                };
                                                readonly arguments: {
                                                    readonly title: "Arguments";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textchatResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextChatStreamCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: readonly ["string", "null"];
                readonly description: "Start your conversation here...";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly chatbot_global_action: {
                readonly type: readonly ["string", "null"];
                readonly description: "A system message that helps set the behavior of the assistant. For example, 'You are a helpful assistant'.";
                readonly examples: readonly ["You are a keyword extractor. Extract Only the word from the text provided."];
            };
            readonly previous_history: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly role: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly examples: readonly ["user"];
                        };
                        readonly message: {};
                        readonly tools: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                        readonly description: "The name of your tool/function";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                    };
                                    readonly parameters: {
                                        readonly description: "The tool's parameters are specified using a JSON Schema object. Detailed format documentation is available in the [JSON Schema reference](https://json-schema.org/understanding-json-schema/).\n\n**Make sure to well describe each parameter for best results.**\n\n\nExample for a weather tool:\n\n    {\n      \"type\": \"object\",\n      \"properties\": {\n        \"location\": {\n          \"type\": \"string\"\n          \"description\": \"The geographical location for which weather data is requested.\"\n        },\n        \"unit\": {\n          \"type\": \"string\", \"enum\": [\"Celsius\", \"Fahrenheit\"]\n          \"description\": \"The unit of measurement for temperature.\"\n        }\n      },\n      \"required\": [\"location\"]\n    }\n    ";
                                    };
                                };
                                readonly required: readonly ["description", "name", "parameters"];
                            };
                        };
                        readonly tool_calls: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly arguments: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                };
                                readonly required: readonly ["arguments", "id", "name"];
                            };
                        };
                    };
                    readonly required: readonly ["message", "role"];
                };
                readonly description: "A list containing all the previous conversations between the user and the chatbot AI. Each item in the list should be a dictionary with two keys: 'role' and 'message'. The 'role' key specifies the role of the speaker and can have the values 'user' or 'assistant'. The 'message' key contains the text of the conversation from the respective role. For example: [{'role': 'user', 'message': 'Hello'}, {'role': 'assistant', 'message': 'Hi, how can I help you?'}, ...]. This format allows easy identification of the speaker's role and their corresponding message.";
            };
            readonly temperature: {
                readonly type: "number";
                readonly format: "double";
                readonly maximum: 2;
                readonly minimum: 0;
                readonly default: 0;
                readonly description: "Higher values mean the model will take more risks and value 0 (argmax sampling) works better for scenarios with a well-defined answer.";
            };
            readonly max_tokens: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly default: 1000;
                readonly description: "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.";
                readonly examples: readonly [100];
            };
            readonly tool_choice: {
                readonly default: "auto";
                readonly description: "* `auto` - auto\n* `required` - required\n* `none` - none\n\nDefault: `auto`";
                readonly enum: readonly ["auto", "required", "none"];
                readonly type: "string";
            };
            readonly available_tools: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "The name of your tool/function";
                        };
                        readonly description: {
                            readonly type: "string";
                        };
                        readonly parameters: {
                            readonly description: "The tool's parameters are specified using a JSON Schema object. Detailed format documentation is available in the [JSON Schema reference](https://json-schema.org/understanding-json-schema/).\n\n**Make sure to well describe each parameter for best results.**\n\n\nExample for a weather tool:\n\n    {\n      \"type\": \"object\",\n      \"properties\": {\n        \"location\": {\n          \"type\": \"string\"\n          \"description\": \"The geographical location for which weather data is requested.\"\n        },\n        \"unit\": {\n          \"type\": \"string\", \"enum\": [\"Celsius\", \"Fahrenheit\"]\n          \"description\": \"The unit of measurement for temperature.\"\n        }\n      },\n      \"required\": [\"location\"]\n    }\n    ";
                        };
                    };
                    readonly required: readonly ["description", "name", "parameters"];
                };
                readonly description: "A list of tools the model may generate the right arguments for.";
            };
            readonly tool_results: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "the id of the `tool_call` used to generate result";
                        };
                        readonly result: {
                            readonly type: "string";
                            readonly minLength: 1;
                            readonly description: "the result of your function";
                        };
                    };
                    readonly required: readonly ["id", "result"];
                };
                readonly description: "List of results obtained from applying the tool_call arguments to your own tool.";
            };
            readonly fallback_type: {
                readonly default: "continue";
                readonly enum: readonly ["rerun", "continue"];
                readonly type: "string";
                readonly description: "* `rerun` - Rerun\n* `continue` - Continue\n\nDefault: `continue`";
            };
        };
        readonly required: readonly ["providers"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextCodeGenerationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly prompt: {
                readonly type: readonly ["string", "null"];
                readonly description: "Entrer the source code that will be used as a context.";
            };
            readonly instruction: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Entrer the instruction you want to be followed.";
                readonly examples: readonly ["Write a function in python that calculates fibonacci"];
            };
            readonly temperature: {
                readonly type: "number";
                readonly format: "double";
                readonly maximum: 1;
                readonly minimum: 0;
                readonly default: 0;
                readonly description: "Higher values mean the model will take more risks and value 0 (argmax sampling) works better for scenarios with a well-defined answer.";
                readonly examples: readonly [0.1];
            };
            readonly max_tokens: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly default: 1000;
                readonly description: "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.";
                readonly examples: readonly [100];
            };
        };
        readonly required: readonly ["instruction", "providers"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly nlpcloud: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textcode_generationCodeGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textcode_generationCodeGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textcode_generationCodeGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textcode_generationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextCustomClassificationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly texts: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["Confirm your email address"];
                };
                readonly description: "List of texts to classify";
            };
            readonly labels: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["spam"];
                };
                readonly description: "List of the labels (classes) you want the texts to be classified as.";
            };
            readonly examples: {
                readonly type: "array";
                readonly items: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly minLength: 1;
                        readonly examples: readonly ["I need help please wire me $1000 right now"];
                    };
                    readonly maxItems: 2;
                    readonly minItems: 2;
                };
                readonly description: "List of text/label pairs (eg: [['I need help please wire me $1000 right now', 'spam'],]";
            };
        };
        readonly required: readonly ["examples", "labels", "providers", "texts"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textcustom_classificationCustomClassificationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly classifications: {
                            readonly title: "Classifications";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["input", "label", "confidence"];
                                readonly title: "ItemCustomClassificationDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly input: {
                                        readonly title: "Input";
                                        readonly type: "string";
                                    };
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly confidence: {
                                        readonly title: "Confidence";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["status"];
                    readonly title: "textcustom_classificationCustomClassificationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly classifications: {
                            readonly title: "Classifications";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["input", "label", "confidence"];
                                readonly title: "ItemCustomClassificationDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly input: {
                                        readonly title: "Input";
                                        readonly type: "string";
                                    };
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly confidence: {
                                        readonly title: "Confidence";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textcustom_classificationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextCustomNamedEntityRecognitionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Enter your input text.";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly entities: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["Politician"];
                };
                readonly description: "List of entities (at least two) to extract from your text eg : ['job', 'country'].";
                readonly minItems: 2;
            };
            readonly examples: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
                readonly description: "List of examples eg : [{'text': 'an input text', 'entities' : [{'entity':'entity_1', 'category':'category_1'}, ...]}, ...]";
            };
        };
        readonly required: readonly ["entities", "providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textcustom_named_entity_recognitionCustomNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category"];
                                readonly title: "InfosCustomNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["status"];
                    readonly title: "textcustom_named_entity_recognitionCustomNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category"];
                                readonly title: "InfosCustomNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "textcustom_named_entity_recognitionCustomNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category"];
                                readonly title: "InfosCustomNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textcustom_named_entity_recognitionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextEmbeddingsCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly texts: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["Hello world"];
                };
                readonly description: "List of texts to transform into embeddings.";
            };
        };
        readonly required: readonly ["providers", "texts"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly jina: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ai21labs: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly mistral: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["status"];
                    readonly title: "textembeddingsEmbeddingsDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["embedding"];
                                readonly title: "EmbeddingDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly embedding: {
                                        readonly title: "Embedding";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "integer";
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textembeddingsResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextEmotionDetectionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["I'm scared!"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly nlpcloud: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textemotion_detectionEmotionDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in EmotionAnalysisDataClass to list emotion analysed.\nArgs:\n    - emotion (EmotionEnum): emotion of the text\n    - emotion_score (float): score of the emotion";
                                readonly required: readonly ["emotion", "emotion_score"];
                                readonly title: "EmotionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly emotion: {
                                        readonly title: "Emotion";
                                        readonly type: "string";
                                    };
                                    readonly emotion_score: {
                                        readonly maximum: 100;
                                        readonly minimum: 0;
                                        readonly title: "Emotion Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly vernai: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textemotion_detectionEmotionDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in EmotionAnalysisDataClass to list emotion analysed.\nArgs:\n    - emotion (EmotionEnum): emotion of the text\n    - emotion_score (float): score of the emotion";
                                readonly required: readonly ["emotion", "emotion_score"];
                                readonly title: "EmotionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly emotion: {
                                        readonly title: "Emotion";
                                        readonly type: "string";
                                    };
                                    readonly emotion_score: {
                                        readonly maximum: 100;
                                        readonly minimum: 0;
                                        readonly title: "Emotion Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textemotion_detectionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextEntitySentimentCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Overall I am satisfied with my experience at Amazon, but two areas of major improvement needed. First is the product reviews and pricing. There are thousands of positive reviews for so many items, and it's clear that the reviews are bogus or not really associated with that product. There needs to be a way to only view products sold by Amazon directly, because many market sellers way overprice items that can be purchased cheaper elsewhere (like Walmart, Target, etc). The second issue is they make it too difficult to get help when there's an issue with an order."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly google: {
                    readonly required: readonly ["items", "status"];
                    readonly title: "textentity_sentimentEntitySentimentDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["type", "text", "sentiment"];
                                readonly title: "Entity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly type: {
                                        readonly description: "Recognized Entity type";
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly text: {
                                        readonly description: "Text corresponding to the entity";
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral", "Mixed"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral` `Mixed`";
                                    };
                                    readonly begin_offset: {
                                        readonly default: any;
                                        readonly title: "Begin Offset";
                                        readonly type: "integer";
                                    };
                                    readonly end_offset: {
                                        readonly default: any;
                                        readonly title: "End Offset";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["items", "status"];
                    readonly title: "textentity_sentimentEntitySentimentDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["type", "text", "sentiment"];
                                readonly title: "Entity";
                                readonly type: "object";
                                readonly properties: {
                                    readonly type: {
                                        readonly description: "Recognized Entity type";
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly text: {
                                        readonly description: "Text corresponding to the entity";
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral", "Mixed"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral` `Mixed`";
                                    };
                                    readonly begin_offset: {
                                        readonly default: any;
                                        readonly title: "Begin Offset";
                                        readonly type: "integer";
                                    };
                                    readonly end_offset: {
                                        readonly default: any;
                                        readonly title: "End Offset";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textentity_sentimentResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextGenerationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Enter your prompt";
                readonly examples: readonly ["The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?"];
            };
            readonly temperature: {
                readonly type: "number";
                readonly format: "double";
                readonly maximum: 1;
                readonly minimum: 0;
                readonly default: 0;
                readonly description: "Higher values mean the model will take more risks and value 0 (argmax sampling) works better for scenarios with a well-defined answer.";
            };
            readonly max_tokens: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly default: 1000;
                readonly description: "The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.";
                readonly examples: readonly [10];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly clarifai: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ai21labs: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly anthropic: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly meta: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly mistral: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["generated_text", "status"];
                    readonly title: "textgenerationGenerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly generated_text: {
                            readonly title: "Generated Text";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textgenerationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextKeywordExtractionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly ibm: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly tenstorrent: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly emvista: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly oneai: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly nlpcloud: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly corticalio: {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "textkeyword_extractionKeywordExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["keyword", "importance"];
                                readonly title: "InfosKeywordExtractionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly keyword: {
                                        readonly title: "Keyword";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textkeyword_extractionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextModerationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Is this a crap email abcdef@abcd.com, phone: 0617730730, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052"];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly clarifai: {
                    readonly required: readonly ["nsfw_likelihood", "nsfw_likelihood_score", "status"];
                    readonly title: "textmoderationModerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly nsfw_likelihood: {
                            readonly title: "Nsfw Likelihood";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["label", "likelihood", "category", "subcategory", "likelihood_score"];
                                readonly title: "TextModerationItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly likelihood: {
                                        readonly title: "Likelihood";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["Insult", "Obscene", "Derogatory", "Profanity", "Threat", "Toxic"];
                                            readonly title: "ToxicSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Insult` `Obscene` `Derogatory` `Profanity` `Threat` `Toxic`";
                                        }, {
                                            readonly enum: readonly ["MiddleFinger", "PublicSafety", "Health", "Explicit", "QRCode", "Medical", "Politics", "Legal"];
                                            readonly title: "ContentSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`MiddleFinger` `PublicSafety` `Health` `Explicit` `QRCode` `Medical` `Politics` `Legal`";
                                        }, {
                                            readonly enum: readonly ["SexualActivity", "SexualSituations", "Nudity", "PartialNudity", "Suggestive", "AdultToys", "RevealingClothes", "Sexual"];
                                            readonly title: "SexualSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SexualActivity` `SexualSituations` `Nudity` `PartialNudity` `Suggestive` `AdultToys` `RevealingClothes` `Sexual`";
                                        }, {
                                            readonly enum: readonly ["GraphicViolenceOrGore", "PhysicalViolence", "WeaponViolence", "Violence"];
                                            readonly title: "ViolenceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`GraphicViolenceOrGore` `PhysicalViolence` `WeaponViolence` `Violence`";
                                        }, {
                                            readonly enum: readonly ["DrugProducts", "DrugUse", "Tobacco", "Smoking", "Alcohol", "Drinking"];
                                            readonly title: "DrugAndAlcoholSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`DrugProducts` `DrugUse` `Tobacco` `Smoking` `Alcohol` `Drinking`";
                                        }, {
                                            readonly enum: readonly ["Gambling", "Finance", "MoneyContent"];
                                            readonly title: "FinanceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Gambling` `Finance` `MoneyContent`";
                                        }, {
                                            readonly enum: readonly ["Hate", "Harassment", "Threatening", "Extremist", "Racy"];
                                            readonly title: "HateAndExtremismSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Hate` `Harassment` `Threatening` `Extremist` `Racy`";
                                        }, {
                                            readonly enum: readonly ["Safe", "NotSafe"];
                                            readonly title: "SafeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Safe` `NotSafe`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly likelihood_score: {
                                        readonly title: "Likelihood Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly nsfw_likelihood_score: {
                            readonly title: "Nsfw Likelihood Score";
                            readonly type: "integer";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["nsfw_likelihood", "nsfw_likelihood_score", "status"];
                    readonly title: "textmoderationModerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly nsfw_likelihood: {
                            readonly title: "Nsfw Likelihood";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["label", "likelihood", "category", "subcategory", "likelihood_score"];
                                readonly title: "TextModerationItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly likelihood: {
                                        readonly title: "Likelihood";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["Insult", "Obscene", "Derogatory", "Profanity", "Threat", "Toxic"];
                                            readonly title: "ToxicSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Insult` `Obscene` `Derogatory` `Profanity` `Threat` `Toxic`";
                                        }, {
                                            readonly enum: readonly ["MiddleFinger", "PublicSafety", "Health", "Explicit", "QRCode", "Medical", "Politics", "Legal"];
                                            readonly title: "ContentSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`MiddleFinger` `PublicSafety` `Health` `Explicit` `QRCode` `Medical` `Politics` `Legal`";
                                        }, {
                                            readonly enum: readonly ["SexualActivity", "SexualSituations", "Nudity", "PartialNudity", "Suggestive", "AdultToys", "RevealingClothes", "Sexual"];
                                            readonly title: "SexualSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SexualActivity` `SexualSituations` `Nudity` `PartialNudity` `Suggestive` `AdultToys` `RevealingClothes` `Sexual`";
                                        }, {
                                            readonly enum: readonly ["GraphicViolenceOrGore", "PhysicalViolence", "WeaponViolence", "Violence"];
                                            readonly title: "ViolenceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`GraphicViolenceOrGore` `PhysicalViolence` `WeaponViolence` `Violence`";
                                        }, {
                                            readonly enum: readonly ["DrugProducts", "DrugUse", "Tobacco", "Smoking", "Alcohol", "Drinking"];
                                            readonly title: "DrugAndAlcoholSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`DrugProducts` `DrugUse` `Tobacco` `Smoking` `Alcohol` `Drinking`";
                                        }, {
                                            readonly enum: readonly ["Gambling", "Finance", "MoneyContent"];
                                            readonly title: "FinanceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Gambling` `Finance` `MoneyContent`";
                                        }, {
                                            readonly enum: readonly ["Hate", "Harassment", "Threatening", "Extremist", "Racy"];
                                            readonly title: "HateAndExtremismSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Hate` `Harassment` `Threatening` `Extremist` `Racy`";
                                        }, {
                                            readonly enum: readonly ["Safe", "NotSafe"];
                                            readonly title: "SafeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Safe` `NotSafe`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly likelihood_score: {
                                        readonly title: "Likelihood Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly nsfw_likelihood_score: {
                            readonly title: "Nsfw Likelihood Score";
                            readonly type: "integer";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["nsfw_likelihood", "nsfw_likelihood_score", "status"];
                    readonly title: "textmoderationModerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly nsfw_likelihood: {
                            readonly title: "Nsfw Likelihood";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["label", "likelihood", "category", "subcategory", "likelihood_score"];
                                readonly title: "TextModerationItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly likelihood: {
                                        readonly title: "Likelihood";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["Insult", "Obscene", "Derogatory", "Profanity", "Threat", "Toxic"];
                                            readonly title: "ToxicSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Insult` `Obscene` `Derogatory` `Profanity` `Threat` `Toxic`";
                                        }, {
                                            readonly enum: readonly ["MiddleFinger", "PublicSafety", "Health", "Explicit", "QRCode", "Medical", "Politics", "Legal"];
                                            readonly title: "ContentSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`MiddleFinger` `PublicSafety` `Health` `Explicit` `QRCode` `Medical` `Politics` `Legal`";
                                        }, {
                                            readonly enum: readonly ["SexualActivity", "SexualSituations", "Nudity", "PartialNudity", "Suggestive", "AdultToys", "RevealingClothes", "Sexual"];
                                            readonly title: "SexualSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SexualActivity` `SexualSituations` `Nudity` `PartialNudity` `Suggestive` `AdultToys` `RevealingClothes` `Sexual`";
                                        }, {
                                            readonly enum: readonly ["GraphicViolenceOrGore", "PhysicalViolence", "WeaponViolence", "Violence"];
                                            readonly title: "ViolenceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`GraphicViolenceOrGore` `PhysicalViolence` `WeaponViolence` `Violence`";
                                        }, {
                                            readonly enum: readonly ["DrugProducts", "DrugUse", "Tobacco", "Smoking", "Alcohol", "Drinking"];
                                            readonly title: "DrugAndAlcoholSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`DrugProducts` `DrugUse` `Tobacco` `Smoking` `Alcohol` `Drinking`";
                                        }, {
                                            readonly enum: readonly ["Gambling", "Finance", "MoneyContent"];
                                            readonly title: "FinanceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Gambling` `Finance` `MoneyContent`";
                                        }, {
                                            readonly enum: readonly ["Hate", "Harassment", "Threatening", "Extremist", "Racy"];
                                            readonly title: "HateAndExtremismSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Hate` `Harassment` `Threatening` `Extremist` `Racy`";
                                        }, {
                                            readonly enum: readonly ["Safe", "NotSafe"];
                                            readonly title: "SafeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Safe` `NotSafe`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly likelihood_score: {
                                        readonly title: "Likelihood Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly nsfw_likelihood_score: {
                            readonly title: "Nsfw Likelihood Score";
                            readonly type: "integer";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["nsfw_likelihood", "nsfw_likelihood_score", "status"];
                    readonly title: "textmoderationModerationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly nsfw_likelihood: {
                            readonly title: "Nsfw Likelihood";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["label", "likelihood", "category", "subcategory", "likelihood_score"];
                                readonly title: "TextModerationItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly label: {
                                        readonly title: "Label";
                                        readonly type: "string";
                                    };
                                    readonly likelihood: {
                                        readonly title: "Likelihood";
                                        readonly type: "integer";
                                    };
                                    readonly category: {
                                        readonly description: "This enum are used to categorize the entities extracted from the text.\n\n`PersonalInformation` `FinancialInformation` `IdentificationNumbers` `Miscellaneous` `OrganizationInformation` `DateAndTime` `LocationInformation` `Other`";
                                        readonly enum: readonly ["PersonalInformation", "FinancialInformation", "IdentificationNumbers", "Miscellaneous", "OrganizationInformation", "DateAndTime", "LocationInformation", "Other"];
                                        readonly title: "CategoryType";
                                        readonly type: "string";
                                    };
                                    readonly subcategory: {
                                        readonly anyOf: readonly [{
                                            readonly enum: readonly ["Insult", "Obscene", "Derogatory", "Profanity", "Threat", "Toxic"];
                                            readonly title: "ToxicSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Insult` `Obscene` `Derogatory` `Profanity` `Threat` `Toxic`";
                                        }, {
                                            readonly enum: readonly ["MiddleFinger", "PublicSafety", "Health", "Explicit", "QRCode", "Medical", "Politics", "Legal"];
                                            readonly title: "ContentSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`MiddleFinger` `PublicSafety` `Health` `Explicit` `QRCode` `Medical` `Politics` `Legal`";
                                        }, {
                                            readonly enum: readonly ["SexualActivity", "SexualSituations", "Nudity", "PartialNudity", "Suggestive", "AdultToys", "RevealingClothes", "Sexual"];
                                            readonly title: "SexualSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`SexualActivity` `SexualSituations` `Nudity` `PartialNudity` `Suggestive` `AdultToys` `RevealingClothes` `Sexual`";
                                        }, {
                                            readonly enum: readonly ["GraphicViolenceOrGore", "PhysicalViolence", "WeaponViolence", "Violence"];
                                            readonly title: "ViolenceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`GraphicViolenceOrGore` `PhysicalViolence` `WeaponViolence` `Violence`";
                                        }, {
                                            readonly enum: readonly ["DrugProducts", "DrugUse", "Tobacco", "Smoking", "Alcohol", "Drinking"];
                                            readonly title: "DrugAndAlcoholSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`DrugProducts` `DrugUse` `Tobacco` `Smoking` `Alcohol` `Drinking`";
                                        }, {
                                            readonly enum: readonly ["Gambling", "Finance", "MoneyContent"];
                                            readonly title: "FinanceSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Gambling` `Finance` `MoneyContent`";
                                        }, {
                                            readonly enum: readonly ["Hate", "Harassment", "Threatening", "Extremist", "Racy"];
                                            readonly title: "HateAndExtremismSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Hate` `Harassment` `Threatening` `Extremist` `Racy`";
                                        }, {
                                            readonly enum: readonly ["Safe", "NotSafe"];
                                            readonly title: "SafeSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Safe` `NotSafe`";
                                        }, {
                                            readonly enum: readonly ["Other", "Anonymized", "Nerd", "Wsd", "Unknown"];
                                            readonly title: "OtherSubCategoryType";
                                            readonly type: "string";
                                            readonly description: "`Other` `Anonymized` `Nerd` `Wsd` `Unknown`";
                                        }];
                                        readonly title: "Subcategory";
                                    };
                                    readonly likelihood_score: {
                                        readonly title: "Likelihood Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly nsfw_likelihood_score: {
                            readonly title: "Nsfw Likelihood Score";
                            readonly type: "integer";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textmoderationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextNamedEntityRecognitionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly lettria: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ibm: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly tenstorrent: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly neuralspace: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly oneai: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly nlpcloud: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "textnamed_entity_recognitionNamedEntityRecognitionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["entity", "category", "importance"];
                                readonly title: "InfosNamedEntityRecognitionDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly entity: {
                                        readonly title: "Entity";
                                        readonly type: "string";
                                    };
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textnamed_entity_recognitionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextPlagiaDetectionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "A text content on which a plagiarism detection analysis will be run";
                readonly examples: readonly ["The Galaxy S23 launch may be far behind us, but Samsung likely has plenty more to announce in 2023.             That's if history repeats itself. Should Samsung stick to its annual routine, we can expect to see new             foldable phones and wearable devices in August. The company also previewed new designs for bendable phones and tablets             earlier this year, hinting that the company may be planning to expand beyond the Z Fold and Z Flip in the near future.             Though Samsung regularly releases new products across many categories, including TVs, home appliances and monitors,             I'm most interested in where its mobile devices are headed. Samsung is one of the world's largest smartphone manufacturers             by market share, meaning it has more influence than most other tech companies on the devices we carry in our pockets each day.             Wearables have also become a large part of how Samsung intends to differentiate its phones from those of other Android device makers.             It's a strategy to create a web of products that keep people hooked, much like Apple's range of devices."];
            };
            readonly title: {
                readonly type: readonly ["string", "null"];
                readonly description: "Content title";
                readonly examples: readonly ["n'importe nawak"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly winstonai: {
                    readonly required: readonly ["plagia_score", "status"];
                    readonly title: "textplagia_detectionPlagiaDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly plagia_score: {
                            readonly title: "Plagia Score";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text"];
                                readonly title: "PlagiaDetectionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly candidates: {
                                        readonly title: "Candidates";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["url", "plagia_score", "prediction", "plagiarized_text"];
                                            readonly title: "PlagiaDetectionCandidate";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly url: {
                                                    readonly title: "Url";
                                                    readonly type: "string";
                                                };
                                                readonly plagia_score: {
                                                    readonly title: "Plagia Score";
                                                    readonly type: "integer";
                                                };
                                                readonly prediction: {
                                                    readonly title: "Prediction";
                                                    readonly type: "string";
                                                };
                                                readonly plagiarized_text: {
                                                    readonly title: "Plagiarized Text";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly originalityai: {
                    readonly required: readonly ["plagia_score", "status"];
                    readonly title: "textplagia_detectionPlagiaDetectionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly plagia_score: {
                            readonly title: "Plagia Score";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text"];
                                readonly title: "PlagiaDetectionItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly candidates: {
                                        readonly title: "Candidates";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly required: readonly ["url", "plagia_score", "prediction", "plagiarized_text"];
                                            readonly title: "PlagiaDetectionCandidate";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly url: {
                                                    readonly title: "Url";
                                                    readonly type: "string";
                                                };
                                                readonly plagia_score: {
                                                    readonly title: "Plagia Score";
                                                    readonly type: "integer";
                                                };
                                                readonly prediction: {
                                                    readonly title: "Prediction";
                                                    readonly type: "string";
                                                };
                                                readonly plagiarized_text: {
                                                    readonly title: "Plagiarized Text";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textplagia_detectionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextPromptOptimizationCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Description of the desired prompt.";
                readonly examples: readonly ["Entity extractor, i give you an entity or multiple entities and a text and i want the entitites extracted from the text"];
            };
            readonly target_provider: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Select the provider for the prompt optimization";
                readonly examples: readonly ["google"];
            };
        };
        readonly required: readonly ["providers", "target_provider", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly openai: {
                    readonly required: readonly ["missing_information", "status"];
                    readonly title: "textprompt_optimizationPromptOptimizationDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly missing_information: {
                            readonly title: "Missing Information";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["text"];
                                readonly title: "PromptDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textprompt_optimizationResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextQuestionAnswerCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly texts: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["The bar-shouldered dove (Geopelia humeralis) is a species of dove, in the family Columbidae, native to Australia and southern New Guinea. Its typical habitat consists of areas of thick vegetation where water is present, damp gullies, forests and gorges, mangroves, plantations, swamps, eucalyptus woodland, tropical and sub-tropical shrubland, and river margins. It can be found in both inland and coastal regions."];
                };
                readonly description: "List of texts to analyze";
            };
            readonly question: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Question about the text content";
                readonly examples: readonly ["What is the scientific name of bar-shouldered dove?"];
            };
            readonly temperature: {
                readonly type: "number";
                readonly format: "double";
                readonly maximum: 1;
                readonly minimum: 0;
                readonly default: 0;
                readonly description: "Higher values mean the model will take more risks and value 0 (argmax sampling) works better for scenarios with a well-defined answer.";
            };
            readonly examples_context: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "example text serving as context";
                readonly examples: readonly ["In 2017, U.S. life expectancy was 78.6 years."];
            };
            readonly examples: {
                readonly type: "array";
                readonly items: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                        readonly minLength: 1;
                        readonly examples: readonly ["What is human life expectancy in the United States?"];
                    };
                    readonly maxItems: 2;
                    readonly minItems: 2;
                };
                readonly description: "List of question/answer pairs (eg: [['When was Barack Obama elected president?', 'in 2009.'],]";
            };
        };
        readonly required: readonly ["examples", "examples_context", "providers", "question", "texts"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly tenstorrent: {
                    readonly required: readonly ["status"];
                    readonly title: "textquestion_answerQuestionAnswerDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly answers: {
                            readonly title: "Answers";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textquestion_answerQuestionAnswerDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly answers: {
                            readonly title: "Answers";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "textquestion_answerQuestionAnswerDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly answers: {
                            readonly title: "Answers";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textquestion_answerResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextSearchCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly texts: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly examples: readonly ["In Roman mythology, Romulus and Remus (Latin: [ˈroːmʊlʊs], [ˈrɛmʊs]) are twin brothers whose story tells of the events that led to the founding of the city of Rome and the Roman Kingdom by Romulus."];
                };
                readonly description: "A list of texts to search in.";
                readonly minItems: 2;
            };
            readonly query: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Your text query.";
                readonly examples: readonly ["Rome"];
            };
            readonly similarity_metric: {
                readonly default: "cosine";
                readonly description: "* `cosine` - cosine\n* `manhattan` - manhattan\n* `euclidean` - euclidean\n\nDefault: `cosine`";
                readonly enum: readonly ["cosine", "manhattan", "euclidean"];
                readonly type: "string";
            };
        };
        readonly required: readonly ["providers", "query", "texts"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly google: {
                    readonly required: readonly ["status"];
                    readonly title: "textsearchSearchDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["object", "document", "score"];
                                readonly title: "InfosSearchDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly object: {
                                        readonly title: "Object";
                                        readonly type: "string";
                                    };
                                    readonly document: {
                                        readonly title: "Document";
                                        readonly type: "integer";
                                    };
                                    readonly score: {
                                        readonly title: "Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "textsearchSearchDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["object", "document", "score"];
                                readonly title: "InfosSearchDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly object: {
                                        readonly title: "Object";
                                        readonly type: "string";
                                    };
                                    readonly document: {
                                        readonly title: "Document";
                                        readonly type: "integer";
                                    };
                                    readonly score: {
                                        readonly title: "Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["status"];
                    readonly title: "textsearchSearchDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["object", "document", "score"];
                                readonly title: "InfosSearchDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly object: {
                                        readonly title: "Object";
                                        readonly type: "string";
                                    };
                                    readonly document: {
                                        readonly title: "Document";
                                        readonly type: "integer";
                                    };
                                    readonly score: {
                                        readonly title: "Score";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textsearchResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextSentimentAnalysisCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Overall I am satisfied with my experience at Amazon, but two areas of major improvement needed. First is the product reviews and pricing. There are thousands of positive reviews for so many items, and it's clear that the reviews are bogus or not really associated with that product. There needs to be a way to only view products sold by Amazon directly, because many market sellers way overprice items that can be purchased cheaper elsewhere (like Walmart, Target, etc). The second issue is they make it too difficult to get help when there's an issue with an order."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly lettria: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ibm: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly sapling: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly tenstorrent: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly emvista: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly connexun: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly oneai: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly nlpcloud: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["general_sentiment", "general_sentiment_rate", "status"];
                    readonly title: "textsentiment_analysisSentimentAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly general_sentiment: {
                            readonly title: "General Sentiment";
                            readonly enum: readonly ["Positive", "Negative", "Neutral"];
                            readonly type: "string";
                            readonly description: "`Positive` `Negative` `Neutral`";
                        };
                        readonly general_sentiment_rate: {
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "General Sentiment Rate";
                            readonly type: "integer";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "This class is used in SentimentAnalysisDataClass to describe each segment analyzed.\n\nArgs:\n    - segment (str): The segment analyzed\n    - sentiment (Literal['Positve', 'Negative', 'Neutral']) (Case is ignore): Sentiment of segment\n    - sentiment_rate (float between 0 and 1): Rate of sentiment";
                                readonly required: readonly ["segment", "sentiment", "sentiment_rate"];
                                readonly title: "SegmentSentimentAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly segment: {
                                        readonly title: "Segment";
                                        readonly type: "string";
                                    };
                                    readonly sentiment: {
                                        readonly title: "Sentiment";
                                        readonly enum: readonly ["Positive", "Negative", "Neutral"];
                                        readonly type: "string";
                                        readonly description: "`Positive` `Negative` `Neutral`";
                                    };
                                    readonly sentiment_rate: {
                                        readonly maximum: 1;
                                        readonly minimum: 0;
                                        readonly title: "Sentiment Rate";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textsentiment_analysisResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextSpellCheckCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Hollo, wrld! How re yu?"];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly cohere: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ai21labs: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly prowritingaid: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly sapling: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly nlpcloud: {
                    readonly required: readonly ["text", "status"];
                    readonly title: "textspell_checkSpellCheckDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly text: {
                            readonly title: "Text";
                            readonly type: "string";
                        };
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Represents a spell check item with suggestions.\n\nArgs:\n    text (str): The text to spell check.\n    type (str, optional): The type of the text.\n    offset (int): The offset of the text.\n    length (int): The length of the text.\n    suggestions (Sequence[SuggestionItem], optional): The list of suggestions for the misspelled text.\n\nRaises:\n    ValueError: If the offset or length is not positive.\n\nReturns:\n    SpellCheckItem: An instance of the SpellCheckItem class.";
                                readonly required: readonly ["text", "type", "offset", "length"];
                                readonly title: "SpellCheckItem";
                                readonly type: "object";
                                readonly properties: {
                                    readonly text: {
                                        readonly title: "Text";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly title: "Type";
                                        readonly type: "string";
                                    };
                                    readonly offset: {
                                        readonly minimum: 0;
                                        readonly title: "Offset";
                                        readonly type: "integer";
                                    };
                                    readonly length: {
                                        readonly minimum: 0;
                                        readonly title: "Length";
                                        readonly type: "integer";
                                    };
                                    readonly suggestions: {
                                        readonly title: "Suggestions";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly description: "Represents a suggestion for a misspelled word.\n\nArgs:\n    suggestion (str): The suggested text.\n    score (float, optional): The score of the suggested text (between 0 and 1).\n\nRaises:\n    ValueError: If the score is not between 0 and 1.\n\nReturns:\n    SuggestionItem: An instance of the SuggestionItem class.";
                                            readonly required: readonly ["suggestion", "score"];
                                            readonly title: "SuggestionItem";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly suggestion: {
                                                    readonly title: "Suggestion";
                                                    readonly type: "string";
                                                };
                                                readonly score: {
                                                    readonly maximum: 1;
                                                    readonly minimum: 0;
                                                    readonly title: "Score";
                                                    readonly type: "integer";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textspell_checkResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextSummarizeCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
            readonly output_sentences: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly default: 1;
                readonly examples: readonly [3];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly meaningcloud: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly cohere: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ai21labs: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly writesonic: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly anthropic: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly microsoft: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly emvista: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly alephalpha: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly connexun: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly oneai: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly nlpcloud: {
                    readonly required: readonly ["result", "status"];
                    readonly title: "textsummarizeSummarizeDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly result: {
                            readonly title: "Result";
                            readonly type: "string";
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textsummarizeResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextSyntaxAnalysisCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly lettria: {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ibm: {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly amazon: {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly emvista: {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly google: {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "textsyntax_analysisSyntaxAnalysisDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["word", "importance", "tag", "lemma"];
                                readonly title: "InfosSyntaxAnalysisDataClass";
                                readonly type: "object";
                                readonly properties: {
                                    readonly word: {
                                        readonly title: "Word";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                    readonly tag: {
                                        readonly title: "Tag";
                                        readonly type: "string";
                                    };
                                    readonly lemma: {
                                        readonly title: "Lemma";
                                        readonly type: "string";
                                    };
                                    readonly others: {
                                        readonly title: "Others";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "textsyntax_analysisResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TextTopicExtractionCreate: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly settings: {
                readonly type: "string";
                readonly default: {};
                readonly description: "A dictionnary or a json object to specify specific models to use for some providers. <br>                     It can be in the following format: {\"google\" : \"google_model\", \"ibm\": \"ibm_model\"...}.\n                     ";
            };
            readonly providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "It can be one (ex: **'amazon'** or **'google'**) or multiple provider(s) (ex: **'amazon,microsoft,google'**)             that the data will be redirected to in order to get the processed results.<br>             Providers can also be invoked with specific models (ex: providers: **'amazon/model1, amazon/model2, google/model3'**)";
            };
            readonly fallback_providers: {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                };
                readonly default: readonly [];
                readonly description: "Providers in this list will be used as fallback if the call to provider in `providers` parameter fails.\n    To use this feature, you must input **only one** provider in the `providers` parameter. but you can put up to 5 fallbacks.\n\nThey will be tried in the same order they are input, and it will stop to the first provider who doesn't fail.\n\n\n*Doesn't work with async subfeatures.*\n    ";
                readonly maxItems: 5;
            };
            readonly response_as_dict: {
                readonly type: "boolean";
                readonly default: true;
                readonly description: "Optional : When set to **true** (default), the response is an object of responses with providers names as keys : <br> \n                  ``` {\"google\" : { \"status\": \"success\", ... }, } ``` <br>\n                When set to **false** the response structure is a list of response objects : <br> \n                   ``` [{\"status\": \"success\", \"provider\": \"google\" ... }, ] ```. <br>\n                  ";
            };
            readonly attributes_as_list: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : When set to **false** (default) the structure of the extracted items is list of objects having different attributes : <br>\n     ```{'items': [{\"attribute_1\": \"x1\",\"attribute_2\": \"y2\"}, ... ]}``` <br>\n     When it is set to **true**, the response contains an object with each attribute as a list : <br>\n     ```{ \"attribute_1\": [\"x1\",\"x2\", ...], \"attribute_2\": [y1, y2, ...]}``` ";
            };
            readonly show_base_64: {
                readonly type: "boolean";
                readonly default: true;
            };
            readonly show_original_response: {
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Optional : Shows the original response of the provider.<br>\n        When set to **true**, a new attribute *original_response* will appear in the response object.";
            };
            readonly text: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Text to analyze";
                readonly examples: readonly ["That actor on TV makes movies in Hollywood and also stars in a variety of popular new TV shows."];
            };
            readonly language: {
                readonly type: readonly ["string", "null"];
                readonly description: "Language code for the language the input text is written in (eg: en, fr).";
                readonly examples: readonly ["en"];
            };
        };
        readonly required: readonly ["providers", "text"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly properties: {
                readonly google: {
                    readonly required: readonly ["status"];
                    readonly title: "texttopic_extractionTopicExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["category", "importance"];
                                readonly title: "ExtractedTopic";
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly openai: {
                    readonly required: readonly ["status"];
                    readonly title: "texttopic_extractionTopicExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["category", "importance"];
                                readonly title: "ExtractedTopic";
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly ibm: {
                    readonly required: readonly ["status"];
                    readonly title: "texttopic_extractionTopicExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["category", "importance"];
                                readonly title: "ExtractedTopic";
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly tenstorrent: {
                    readonly required: readonly ["status"];
                    readonly title: "texttopic_extractionTopicExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["category", "importance"];
                                readonly title: "ExtractedTopic";
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
                readonly "eden-ai": {
                    readonly required: readonly ["status"];
                    readonly title: "texttopic_extractionTopicExtractionDataClass";
                    readonly type: "object";
                    readonly properties: {
                        readonly items: {
                            readonly title: "Items";
                            readonly type: "array";
                            readonly items: {
                                readonly required: readonly ["category", "importance"];
                                readonly title: "ExtractedTopic";
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly title: "Category";
                                        readonly type: "string";
                                    };
                                    readonly importance: {
                                        readonly title: "Importance";
                                        readonly type: "integer";
                                    };
                                };
                            };
                        };
                        readonly original_response: {
                            readonly default: any;
                            readonly description: "original response sent by the provider, hidden by default, show it by passing the `show_original_response` field to `true` in your request";
                            readonly title: "Original Response";
                        };
                        readonly status: {
                            readonly title: "Status";
                            readonly enum: readonly ["sucess", "fail"];
                            readonly type: "string";
                            readonly description: "`sucess` `fail`";
                        };
                    };
                };
            };
            readonly title: "texttopic_extractionResponseModel";
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "object";
                            readonly properties: {
                                readonly "<parameter_name>": {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly required: readonly ["<parameter_name>"];
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly details: {
                    readonly type: "string";
                    readonly default: "Not Found";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                        };
                        readonly message: {
                            readonly type: "string";
                        };
                    };
                    readonly required: readonly ["message", "type"];
                };
            };
            readonly required: readonly ["error"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { TextAiDetectionCreate, TextAnonymizationCreate, TextChatCreate, TextChatStreamCreate, TextCodeGenerationCreate, TextCustomClassificationCreate, TextCustomNamedEntityRecognitionCreate, TextEmbeddingsCreate, TextEmotionDetectionCreate, TextEntitySentimentCreate, TextGenerationCreate, TextKeywordExtractionCreate, TextModerationCreate, TextNamedEntityRecognitionCreate, TextPlagiaDetectionCreate, TextPromptOptimizationCreate, TextQuestionAnswerCreate, TextSearchCreate, TextSentimentAnalysisCreate, TextSpellCheckCreate, TextSummarizeCreate, TextSyntaxAnalysisCreate, TextTopicExtractionCreate };
