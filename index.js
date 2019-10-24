"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var chalk_1 = require("chalk");
var DomainInfo = require("./DomainInfo");
var endpointTypes = {
    edge: "EDGE",
    regional: "REGIONAL"
};
var tlsVersions = {
    tls_1_0: "TLS_1_0",
    tls_1_2: "TLS_1_2"
};
var certStatuses = ["PENDING_VALIDATION", "ISSUED", "INACTIVE"];
var ServerlessCustomDomain = /** @class */ (function () {
    function ServerlessCustomDomain(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.commands = {
            create_domain: {
                lifecycleEvents: [
                    "create",
                    "initialize",
                ],
                usage: "Creates a domain using the domain name defined in the serverless file"
            },
            delete_domain: {
                lifecycleEvents: [
                    "delete",
                    "initialize",
                ],
                usage: "Deletes a domain using the domain name defined in the serverless file"
            }
        };
        this.hooks = {
            "after:deploy:deploy": this.hookWrapper.bind(this, this.setupBasePathMapping),
            "after:info:info": this.hookWrapper.bind(this, this.domainSummary),
            "before:remove:remove": this.hookWrapper.bind(this, this.removeBasePathMapping),
            "create_domain:create": this.hookWrapper.bind(this, this.createDomain),
            "delete_domain:delete": this.hookWrapper.bind(this, this.deleteDomain)
        };
    }
    /**
     * Wrapper for lifecycle function, initializes variables and checks if enabled.
     * @param lifecycleFunc lifecycle function that actually does desired action
     */
    ServerlessCustomDomain.prototype.hookWrapper = function (lifecycleFunc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.initializeVariables();
                        if (!!this.enabled) return [3 /*break*/, 1];
                        this.serverless.cli.log("serverless-domain-manager: Custom domain is disabled.");
                        return [2 /*return*/];
                    case 1: return [4 /*yield*/, lifecycleFunc.call(this)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Lifecycle function to create a domain
     * Wraps creating a domain and resource record set
     */
    ServerlessCustomDomain.prototype.createDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainInfo, err_1, certArn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getDomainInfo()];
                    case 1:
                        domainInfo = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        if (err_1.message !== "Error: " + this.givenDomainName + " not found.") {
                            throw err_1;
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        if (!!domainInfo) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getCertArn()];
                    case 4:
                        certArn = _a.sent();
                        return [4 /*yield*/, this.createCustomDomain(certArn)];
                    case 5:
                        domainInfo = _a.sent();
                        return [4 /*yield*/, this.changeResourceRecordSet("UPSERT", domainInfo)];
                    case 6:
                        _a.sent();
                        this.serverless.cli.log("Custom domain " + this.givenDomainName + " was created.\n            New domains may take up to 40 minutes to be initialized.");
                        return [3 /*break*/, 8];
                    case 7:
                        this.serverless.cli.log("Custom domain " + this.givenDomainName + " already exists.");
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lifecycle function to delete a domain
     * Wraps deleting a domain and resource record set
     */
    ServerlessCustomDomain.prototype.deleteDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainInfo, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getDomainInfo()];
                    case 1:
                        domainInfo = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        if (err_2.message === "Error: " + this.givenDomainName + " not found.") {
                            this.serverless.cli.log("Unable to delete custom domain " + this.givenDomainName + ".");
                            return [2 /*return*/];
                        }
                        throw err_2;
                    case 3: return [4 /*yield*/, this.deleteCustomDomain()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.changeResourceRecordSet("DELETE", domainInfo)];
                    case 5:
                        _a.sent();
                        this.serverless.cli.log("Custom domain " + this.givenDomainName + " was deleted.");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lifecycle function to create basepath mapping
     * Wraps creation of basepath mapping and adds domain name info as output to cloudformation stack
     */
    ServerlessCustomDomain.prototype.setupBasePathMapping = function () {
        return __awaiter(this, void 0, void 0, function () {
            var restApiId, currentBasePath, domainInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRestApiId()];
                    case 1:
                        restApiId = _a.sent();
                        return [4 /*yield*/, this.getBasePathMapping(restApiId)];
                    case 2:
                        currentBasePath = _a.sent();
                        if (!!currentBasePath) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createBasePathMapping(restApiId)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.updateBasePathMapping(currentBasePath)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.getDomainInfo()];
                    case 7:
                        domainInfo = _a.sent();
                        this.addOutputs(domainInfo);
                        return [4 /*yield*/, this.printDomainSummary(domainInfo)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lifecycle function to delete basepath mapping
     * Wraps deletion of basepath mapping
     */
    ServerlessCustomDomain.prototype.removeBasePathMapping = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteBasePathMapping()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lifecycle function to print domain summary
     * Wraps printing of all domain manager related info
     */
    ServerlessCustomDomain.prototype.domainSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDomainInfo()];
                    case 1:
                        domainInfo = _a.sent();
                        if (domainInfo) {
                            this.printDomainSummary(domainInfo);
                        }
                        else {
                            this.serverless.cli.log("Unable to print Serverless Domain Manager Summary");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Goes through custom domain property and initializes local variables and cloudformation template
     */
    ServerlessCustomDomain.prototype.initializeVariables = function () {
        this.enabled = this.evaluateEnabled();
        if (this.enabled) {
            var credentials = this.serverless.providers.aws.getCredentials();
            this.serverless.providers.aws.sdk.config.update({ maxRetries: 20 });
            this.apigateway = new this.serverless.providers.aws.sdk.APIGateway(credentials);
            this.route53 = new this.serverless.providers.aws.sdk.Route53(credentials);
            this.cloudformation = new this.serverless.providers.aws.sdk.CloudFormation(credentials);
            this.givenDomainName = this.serverless.service.custom.customDomain.domainName;
            this.hostedZonePrivate = this.serverless.service.custom.customDomain.hostedZonePrivate;
            var basePath = this.serverless.service.custom.customDomain.basePath;
            if (basePath == null || basePath.trim() === "") {
                basePath = "(none)";
            }
            this.basePath = basePath;
            var stage = this.serverless.service.custom.customDomain.stage;
            if (typeof stage === "undefined") {
                stage = this.options.stage || this.serverless.service.provider.stage;
            }
            this.stage = stage;
            var endpointTypeWithDefault = this.serverless.service.custom.customDomain.endpointType ||
                endpointTypes.edge;
            var endpointTypeToUse = endpointTypes[endpointTypeWithDefault.toLowerCase()];
            if (!endpointTypeToUse) {
                throw new Error(endpointTypeWithDefault + " is not supported endpointType, use edge or regional.");
            }
            this.endpointType = endpointTypeToUse;
            var securityPolicyDefault = this.serverless.service.custom.customDomain.securityPolicy ||
                tlsVersions.tls_1_2;
            var tlsVersionToUse = tlsVersions[securityPolicyDefault.toLowerCase()];
            if (!tlsVersionToUse) {
                throw new Error(securityPolicyDefault + " is not a supported securityPolicy, use tls_1_0 or tls_1_2.");
            }
            this.securityPolicy = tlsVersionToUse;
            this.acmRegion = this.endpointType === endpointTypes.regional ?
                this.serverless.providers.aws.getRegion() : "us-east-1";
            var acmCredentials = Object.assign({}, credentials, { region: this.acmRegion });
            this.acm = new this.serverless.providers.aws.sdk.ACM(acmCredentials);
        }
    };
    /**
     * Determines whether this plug-in is enabled.
     *
     * This method reads the customDomain property "enabled" to see if this plug-in should be enabled.
     * If the property's value is undefined, a default value of true is assumed (for backwards
     * compatibility).
     * If the property's value is provided, this should be boolean, otherwise an exception is thrown.
     * If no customDomain object exists, an exception is thrown.
     */
    ServerlessCustomDomain.prototype.evaluateEnabled = function () {
        if (typeof this.serverless.service.custom === "undefined"
            || typeof this.serverless.service.custom.customDomain === "undefined") {
            throw new Error("serverless-domain-manager: Plugin configuration is missing.");
        }
        var enabled = this.serverless.service.custom.customDomain.enabled;
        if (enabled === undefined) {
            return true;
        }
        if (typeof enabled === "boolean") {
            return enabled;
        }
        else if (typeof enabled === "string" && enabled === "true") {
            return true;
        }
        else if (typeof enabled === "string" && enabled === "false") {
            return false;
        }
        throw new Error("serverless-domain-manager: Ambiguous enablement boolean: \"" + enabled + "\"");
    };
    /**
     * Gets Certificate ARN that most closely matches domain name OR given Cert ARN if provided
     */
    ServerlessCustomDomain.prototype.getCertArn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var certificateArn, certificateName, certData, nameLength_1, certificates, foundCertificate, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.serverless.service.custom.customDomain.certificateArn) {
                            this.serverless.cli.log("Selected specific certificateArn " + this.serverless.service.custom.customDomain.certificateArn);
                            return [2 /*return*/, this.serverless.service.custom.customDomain.certificateArn];
                        }
                        certificateName = this.serverless.service.custom.customDomain.certificateName;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.acm.listCertificates({ CertificateStatuses: certStatuses }).promise()];
                    case 2:
                        certData = _a.sent();
                        nameLength_1 = 0;
                        certificates = certData.CertificateSummaryList;
                        // Checks if a certificate name is given
                        if (certificateName != null) {
                            foundCertificate = certificates
                                .find(function (certificate) { return (certificate.DomainName === certificateName); });
                            if (foundCertificate != null) {
                                certificateArn = foundCertificate.CertificateArn;
                            }
                        }
                        else {
                            certificateName = this.givenDomainName;
                            certificates.forEach(function (certificate) {
                                var certificateListName = certificate.DomainName;
                                // Looks for wild card and takes it out when checking
                                if (certificateListName[0] === "*") {
                                    certificateListName = certificateListName.substr(1);
                                }
                                // Looks to see if the name in the list is within the given domain
                                // Also checks if the name is more specific than previous ones
                                if (certificateName.includes(certificateListName)
                                    && certificateListName.length > nameLength_1) {
                                    nameLength_1 = certificateListName.length;
                                    certificateArn = certificate.CertificateArn;
                                }
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        this.logIfDebug(err_3);
                        throw Error("Error: Could not list certificates in Certificate Manager.\n" + err_3);
                    case 4:
                        if (certificateArn == null) {
                            throw Error("Error: Could not find the certificate " + certificateName + ".");
                        }
                        return [2 /*return*/, certificateArn];
                }
            });
        });
    };
    /**
     * Gets domain info as DomainInfo object if domain exists, otherwise returns false
     */
    ServerlessCustomDomain.prototype.getDomainInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainInfo, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.apigateway.getDomainName({ domainName: this.givenDomainName }).promise()];
                    case 1:
                        domainInfo = _a.sent();
                        return [2 /*return*/, new DomainInfo(domainInfo)];
                    case 2:
                        err_4 = _a.sent();
                        this.logIfDebug(err_4);
                        if (err_4.code === "NotFoundException") {
                            throw new Error("Error: " + this.givenDomainName + " not found.");
                        }
                        throw new Error("Error: Unable to fetch information about " + this.givenDomainName);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates Custom Domain Name through API Gateway
     * @param certificateArn: Certificate ARN to use for custom domain
     */
    ServerlessCustomDomain.prototype.createCustomDomain = function (certificateArn) {
        return __awaiter(this, void 0, void 0, function () {
            var params, createdDomain, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            certificateArn: certificateArn,
                            domainName: this.givenDomainName,
                            endpointConfiguration: {
                                types: [this.endpointType]
                            },
                            regionalCertificateArn: certificateArn,
                            securityPolicy: this.securityPolicy
                        };
                        if (this.endpointType === endpointTypes.edge) {
                            params.regionalCertificateArn = undefined;
                        }
                        else if (this.endpointType === endpointTypes.regional) {
                            params.certificateArn = undefined;
                        }
                        createdDomain = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.createDomainName(params).promise()];
                    case 2:
                        createdDomain = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        this.logIfDebug(err_5);
                        throw new Error("Error: Failed to create custom domain " + this.givenDomainName + "\n");
                    case 4: return [2 /*return*/, new DomainInfo(createdDomain)];
                }
            });
        });
    };
    /**
     * Delete Custom Domain Name through API Gateway
     */
    ServerlessCustomDomain.prototype.deleteCustomDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            domainName: this.givenDomainName
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.deleteDomainName(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        this.logIfDebug(err_6);
                        throw new Error("Error: Failed to delete custom domain " + this.givenDomainName + "\n");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Change A Alias record through Route53 based on given action
     * @param action: String descriptor of change to be made. Valid actions are ['UPSERT', 'DELETE']
     * @param domain: DomainInfo object containing info about custom domain
     */
    ServerlessCustomDomain.prototype.changeResourceRecordSet = function (action, domain) {
        return __awaiter(this, void 0, void 0, function () {
            var createRoute53Record, route53HostedZoneId, Changes, params, err_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (action !== "UPSERT" && action !== "DELETE") {
                            throw new Error("Error: Invalid action \"" + action + "\" when changing Route53 Record.\n                Action must be either UPSERT or DELETE.\n");
                        }
                        createRoute53Record = this.serverless.service.custom.customDomain.createRoute53Record;
                        if (createRoute53Record !== undefined && createRoute53Record === false) {
                            this.serverless.cli.log("Skipping creation of Route53 record.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getRoute53HostedZoneId()];
                    case 1:
                        route53HostedZoneId = _a.sent();
                        Changes = ["A", "AAAA"].map(function (Type) { return ({
                            Action: action,
                            ResourceRecordSet: {
                                AliasTarget: {
                                    DNSName: domain.domainName,
                                    EvaluateTargetHealth: false,
                                    HostedZoneId: domain.hostedZoneId
                                },
                                Name: _this.givenDomainName,
                                Type: Type
                            }
                        }); });
                        params = {
                            ChangeBatch: {
                                Changes: Changes,
                                Comment: "Record created by serverless-domain-manager"
                            },
                            HostedZoneId: route53HostedZoneId
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.route53.changeResourceRecordSets(params).promise()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_7 = _a.sent();
                        this.logIfDebug(err_7);
                        throw new Error("Error: Failed to " + action + " A Alias for " + this.givenDomainName + "\n");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets Route53 HostedZoneId from user or from AWS
     */
    ServerlessCustomDomain.prototype.getRoute53HostedZoneId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filterZone, hostedZoneData, givenDomainNameReverse, targetHostedZone, hostedZoneId, startPos, endPos, err_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.serverless.service.custom.customDomain.hostedZoneId) {
                            this.serverless.cli.log("Selected specific hostedZoneId " + this.serverless.service.custom.customDomain.hostedZoneId);
                            return [2 /*return*/, this.serverless.service.custom.customDomain.hostedZoneId];
                        }
                        filterZone = this.hostedZonePrivate !== undefined;
                        if (filterZone && this.hostedZonePrivate) {
                            this.serverless.cli.log("Filtering to only private zones.");
                        }
                        else if (filterZone && !this.hostedZonePrivate) {
                            this.serverless.cli.log("Filtering to only public zones.");
                        }
                        givenDomainNameReverse = this.givenDomainName.split(".").reverse();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.route53.listHostedZones({}).promise()];
                    case 2:
                        hostedZoneData = _a.sent();
                        targetHostedZone = hostedZoneData.HostedZones
                            .filter(function (hostedZone) {
                            var hostedZoneName;
                            if (hostedZone.Name.endsWith(".")) {
                                hostedZoneName = hostedZone.Name.slice(0, -1);
                            }
                            else {
                                hostedZoneName = hostedZone.Name;
                            }
                            if (!filterZone || _this.hostedZonePrivate === hostedZone.Config.PrivateZone) {
                                var hostedZoneNameReverse = hostedZoneName.split(".").reverse();
                                if (givenDomainNameReverse.length === 1
                                    || (givenDomainNameReverse.length >= hostedZoneNameReverse.length)) {
                                    for (var i = 0; i < hostedZoneNameReverse.length; i += 1) {
                                        if (givenDomainNameReverse[i] !== hostedZoneNameReverse[i]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                            return false;
                        })
                            .sort(function (zone1, zone2) { return zone2.Name.length - zone1.Name.length; })
                            .shift();
                        if (targetHostedZone) {
                            hostedZoneId = targetHostedZone.Id;
                            startPos = hostedZoneId.indexOf("e/") + 2;
                            endPos = hostedZoneId.length;
                            return [2 /*return*/, hostedZoneId.substring(startPos, endPos)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _a.sent();
                        this.logIfDebug(err_8);
                        throw new Error("Error: Unable to list hosted zones in Route53.\n" + err_8);
                    case 4: throw new Error("Error: Could not find hosted zone \"" + this.givenDomainName + "\"");
                }
            });
        });
    };
    ServerlessCustomDomain.prototype.getBasePathMapping = function (restApiId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, basepathInfo, currentBasePath, err_9, _i, _a, basepathObj;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            domainName: this.givenDomainName
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.getBasePathMappings(params).promise()];
                    case 2:
                        basepathInfo = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_9 = _b.sent();
                        this.logIfDebug(err_9);
                        throw new Error("Error: Unable to get BasePathMappings for " + this.givenDomainName);
                    case 4:
                        if (basepathInfo.items !== undefined && basepathInfo.items instanceof Array) {
                            for (_i = 0, _a = basepathInfo.items; _i < _a.length; _i++) {
                                basepathObj = _a[_i];
                                if (basepathObj.restApiId === restApiId) {
                                    currentBasePath = basepathObj.basePath;
                                    break;
                                }
                            }
                        }
                        return [2 /*return*/, currentBasePath];
                }
            });
        });
    };
    /**
     * Creates basepath mapping
     */
    ServerlessCustomDomain.prototype.createBasePathMapping = function (restApiId) {
        return __awaiter(this, void 0, void 0, function () {
            var params, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            basePath: this.basePath,
                            domainName: this.givenDomainName,
                            restApiId: restApiId,
                            stage: this.stage
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.createBasePathMapping(params).promise()];
                    case 2:
                        _a.sent();
                        this.serverless.cli.log("Created basepath mapping.");
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _a.sent();
                        this.logIfDebug(err_10);
                        throw new Error("Error: Unable to create basepath mapping.\n");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates basepath mapping
     */
    ServerlessCustomDomain.prototype.updateBasePathMapping = function (oldBasePath) {
        return __awaiter(this, void 0, void 0, function () {
            var params, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            basePath: oldBasePath,
                            domainName: this.givenDomainName,
                            patchOperations: [
                                {
                                    op: "replace",
                                    path: "/basePath",
                                    value: this.basePath
                                },
                            ]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.updateBasePathMapping(params).promise()];
                    case 2:
                        _a.sent();
                        this.serverless.cli.log("Updated basepath mapping.");
                        return [3 /*break*/, 4];
                    case 3:
                        err_11 = _a.sent();
                        this.logIfDebug(err_11);
                        throw new Error("Error: Unable to update basepath mapping.\n");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets rest API id from CloudFormation stack
     */
    ServerlessCustomDomain.prototype.getRestApiId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stackFamilyName, allStackDescriptions, nextToken, params, describeStacksResponse, _i, _a, stackDescription, err_12, familyStackNames, response, _b, familyStackNames_1, familyStackName, err_13, restApiId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.serverless.service.provider.apiGateway && this.serverless.service.provider.apiGateway.restApiId) {
                            this.serverless.cli.log("Mapping custom domain to existing API\n                " + this.serverless.service.provider.apiGateway.restApiId + ".");
                            return [2 /*return*/, this.serverless.service.provider.apiGateway.restApiId];
                        }
                        stackFamilyName = this.serverless.service.provider.stackName ||
                            this.serverless.service.service + "-" + this.stage;
                        allStackDescriptions = [];
                        nextToken = true;
                        _c.label = 1;
                    case 1:
                        if (!nextToken) return [3 /*break*/, 6];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        params = { NextToken: undefined };
                        if (typeof nextToken === "string") {
                            params.NextToken = nextToken;
                        }
                        return [4 /*yield*/, this.cloudformation.describeStacks(params).promise()];
                    case 3:
                        describeStacksResponse = _c.sent();
                        for (_i = 0, _a = describeStacksResponse.Stacks; _i < _a.length; _i++) {
                            stackDescription = _a[_i];
                            allStackDescriptions.push(stackDescription);
                        }
                        nextToken = describeStacksResponse.NextToken;
                        return [3 /*break*/, 5];
                    case 4:
                        err_12 = _c.sent();
                        throw new Error("Error: Retrieving CloudFormation stacks.\n");
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        familyStackNames = allStackDescriptions
                            .map(function (stack) { return stack.StackName; })
                            .filter(function (stackName) { return stackName.includes(stackFamilyName); });
                        _b = 0, familyStackNames_1 = familyStackNames;
                        _c.label = 7;
                    case 7:
                        if (!(_b < familyStackNames_1.length)) return [3 /*break*/, 12];
                        familyStackName = familyStackNames_1[_b];
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.cloudformation.describeStackResource({
                                LogicalResourceId: "ApiGatewayRestApi",
                                StackName: familyStackName
                            }).promise()];
                    case 9:
                        response = _c.sent();
                        return [3 /*break*/, 12];
                    case 10:
                        err_13 = _c.sent();
                        this.logIfDebug(err_13);
                        this.serverless.cli.log("Error: Failed to find CloudFormation resources for " + familyStackName + "\n");
                        return [3 /*break*/, 11];
                    case 11:
                        _b++;
                        return [3 /*break*/, 7];
                    case 12:
                        if (!response) {
                            throw new Error("Error: Failed to find a stack " + stackFamilyName + "\n");
                        }
                        restApiId = response.StackResourceDetail.PhysicalResourceId;
                        if (!restApiId) {
                            throw new Error("Error: No RestApiId associated with CloudFormation stack " + stackFamilyName + "\n");
                        }
                        return [2 /*return*/, restApiId];
                }
            });
        });
    };
    /**
     * Deletes basepath mapping
     */
    ServerlessCustomDomain.prototype.deleteBasePathMapping = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            basePath: this.basePath,
                            domainName: this.givenDomainName
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.apigateway.deleteBasePathMapping(params).promise()];
                    case 2:
                        _a.sent();
                        this.serverless.cli.log("Removed basepath mapping.");
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _a.sent();
                        this.logIfDebug(err_14);
                        this.serverless.cli.log("Unable to remove basepath mapping.");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  Adds the domain name and distribution domain name to the CloudFormation outputs
     */
    ServerlessCustomDomain.prototype.addOutputs = function (domainInfo) {
        var service = this.serverless.service;
        if (!service.provider.compiledCloudFormationTemplate.Outputs) {
            service.provider.compiledCloudFormationTemplate.Outputs = {};
        }
        service.provider.compiledCloudFormationTemplate.Outputs.DomainName = {
            Value: domainInfo.domainName
        };
        if (domainInfo.hostedZoneId) {
            service.provider.compiledCloudFormationTemplate.Outputs.HostedZoneId = {
                Value: domainInfo.hostedZoneId
            };
        }
    };
    /**
     * Logs message if SLS_DEBUG is set
     * @param message message to be printed
     */
    ServerlessCustomDomain.prototype.logIfDebug = function (message) {
        if (process.env.SLS_DEBUG) {
            this.serverless.cli.log(message, "Serverless Domain Manager");
        }
    };
    /**
     * Prints out a summary of all domain manager related info
     */
    ServerlessCustomDomain.prototype.printDomainSummary = function (domainInfo) {
        this.serverless.cli.consoleLog(chalk_1["default"].yellow.underline("Serverless Domain Manager Summary"));
        if (this.serverless.service.custom.customDomain.createRoute53Record !== false) {
            this.serverless.cli.consoleLog(chalk_1["default"].yellow("Domain Name"));
            this.serverless.cli.consoleLog("  " + this.givenDomainName);
        }
        this.serverless.cli.consoleLog(chalk_1["default"].yellow("Distribution Domain Name"));
        this.serverless.cli.consoleLog("  Target Domain: " + domainInfo.domainName);
        this.serverless.cli.consoleLog("  Hosted Zone Id: " + domainInfo.hostedZoneId);
    };
    return ServerlessCustomDomain;
}());
module.exports = ServerlessCustomDomain;
