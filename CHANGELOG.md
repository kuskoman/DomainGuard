# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2025-01-15)


### ⚠ BREAKING CHANGES

* **backend:** implement PoC of notifications module
* **backend:** replace access_token with accessToken in responses
* **frontend:** change login and register forms to use new api
* **backend:** create new, session-based auth logic
* **backend:** remove jwt and use redis-based sessions

### Features

* add basic CRUD to domains service ([320eb33](https://github.com/kuskoman/DomainGuard/commit/320eb33bd20c831a0ccda67929e9e52730b649ac))
* add database module ([b65b81c](https://github.com/kuskoman/DomainGuard/commit/b65b81ca7a11753878cf55f01dae6c9e3f0348f3))
* add domains-expiration module ([b499a6a](https://github.com/kuskoman/DomainGuard/commit/b499a6a3df8f865c236ed48e5bd9090ac46e49b7))
* add function to update expiration of domain in datbase ([34c0b89](https://github.com/kuskoman/DomainGuard/commit/34c0b89d73b4fd2c2d39675d59fe271a2e299578))
* add function to validate whether ssl certificates are valid ([91b3790](https://github.com/kuskoman/DomainGuard/commit/91b3790192efc652f89f6d61937d08dbd486fb69))
* add last_checked_at to domains and ssl ([cb72f08](https://github.com/kuskoman/DomainGuard/commit/cb72f089013dc1ee6a8822d2fe57775d7f325819))
* add user registration ([e0f1936](https://github.com/kuskoman/DomainGuard/commit/e0f1936517b654e5bca87a216b10abc3fc4d41e0))
* **backend:** add a feature adding all certificates belonging to domain ([0d00f81](https://github.com/kuskoman/DomainGuard/commit/0d00f81fdd1a131dc1cc648ec517b69c0b3bceba))
* **backend:** add a method to check for domains not checked recently ([e547d43](https://github.com/kuskoman/DomainGuard/commit/e547d43e925afd2a6f2a2cf17bca79eaa648271d))
* **backend:** add configurable session time ([3a03bb3](https://github.com/kuskoman/DomainGuard/commit/3a03bb3d5b64fc3a1e92ed3738af2f8848be31f5))
* **backend:** add cron to refresh certs and domains ([12817a9](https://github.com/kuskoman/DomainGuard/commit/12817a9dd1279732409b3256d34f07dc79f6368f))
* **backend:** add crtsh module allowing to check ssl certs for domain ([3fd5405](https://github.com/kuskoman/DomainGuard/commit/3fd54057323ff185b4e03a056d256fbe45793418))
* **backend:** add endpoint to get a single cert ([7d0e0dc](https://github.com/kuskoman/DomainGuard/commit/7d0e0dcd89fcb55f23421e1bff666ee5bdb76f30))
* **backend:** add methods for operating on all user sessions ([fddafcb](https://github.com/kuskoman/DomainGuard/commit/fddafcbf6bcf5331cbe7b2e28dd876cbf03027fd))
* **backend:** add new sessions module to replace jwt ([73909be](https://github.com/kuskoman/DomainGuard/commit/73909be6ecc84073f843b7c6b52e2a4a03c363c5))
* **backend:** add notifications about expirations ([b8238c0](https://github.com/kuskoman/DomainGuard/commit/b8238c03c4aee50ca117d9a880f80e9a7c203810))
* **backend:** add possibility to refresh a single cert ([15ad168](https://github.com/kuskoman/DomainGuard/commit/15ad168b46710b878d9c4a9889aabccc4b0aca1d))
* **backend:** add users/me endpoint ([49facac](https://github.com/kuskoman/DomainGuard/commit/49facac1668fd8ad751536e04740ae951471ced5))
* **backend:** add very not optimized way of refreshing all ssl certs ([262ca35](https://github.com/kuskoman/DomainGuard/commit/262ca35b4de8407d4f691186a246995666f64f8a))
* **backend:** create new, session-based auth logic ([b6c8bd5](https://github.com/kuskoman/DomainGuard/commit/b6c8bd5909e1df39610987d509cd515c9a5e3f71))
* **backend:** create redis module ([3125cb5](https://github.com/kuskoman/DomainGuard/commit/3125cb59dcef2fc0ec7eb0a45c531aaf6c0949ba))
* **backend:** implement PoC of notifications module ([06e20d9](https://github.com/kuskoman/DomainGuard/commit/06e20d925f3af6bd2f9baef1a1acf28b52dfa370))
* **backend:** improve logger ([bc38330](https://github.com/kuskoman/DomainGuard/commit/bc3833029f73bbf8f49aee0328a82cd244102eb2))
* **backend:** include ssl certificates with domain ([922ce25](https://github.com/kuskoman/DomainGuard/commit/922ce25e9b90538d671c5cefebd9210915acadb6))
* create auth guard for logged users ([407319e](https://github.com/kuskoman/DomainGuard/commit/407319e6a6dc1cd992d54f4c8e0cfb88ce660a29))
* create user service ([1d4af88](https://github.com/kuskoman/DomainGuard/commit/1d4af88d0195d96fcde0aef28df8e2e511291dc7))
* **frontend:** ad a prototype of domain list page ([414b1e1](https://github.com/kuskoman/DomainGuard/commit/414b1e1f18e828407eb7153bd170736959997c53))
* **frontend:** add "add" button to domains list view ([f640956](https://github.com/kuskoman/DomainGuard/commit/f6409567ef93b9cb1bc36a8ec3b576f83a2d773f))
* **frontend:** add a view to add domain ([d9adaea](https://github.com/kuskoman/DomainGuard/commit/d9adaea8a03bf41f9c92c1b3b09d2fd8c000b78c))
* **frontend:** add about (main) page ([799febf](https://github.com/kuskoman/DomainGuard/commit/799febfea313042b6bf5741764337bba74874b89))
* **frontend:** add alerts store ([2f2345c](https://github.com/kuskoman/DomainGuard/commit/2f2345c4c972b55b7ac0325d4e726a7929a1aeb3))
* **frontend:** add button for creating a new domain ([d5cafb1](https://github.com/kuskoman/DomainGuard/commit/d5cafb1e4bcc70049d954522db82616fee68f933))
* **frontend:** add logic that happens after register and login ([7385107](https://github.com/kuskoman/DomainGuard/commit/73851076ff57f280072757b11d5e08ade4931b80))
* **frontend:** add notifications display page ([52c3b49](https://github.com/kuskoman/DomainGuard/commit/52c3b49d6391b544b4c1d52e6406ae79388e260f))
* **frontend:** add notifications link to drawer ([670c5cd](https://github.com/kuskoman/DomainGuard/commit/670c5cd3ca874aa150464b4ac5b418136922e3d1))
* **frontend:** add page to display and refresh a single cert ([4879f3b](https://github.com/kuskoman/DomainGuard/commit/4879f3b17e6c2e7c0766103b695f1a2a9a181e61))
* **frontend:** add page to display domain details ([59469af](https://github.com/kuskoman/DomainGuard/commit/59469af28e49bdd74beb921fe04601d1dca8bbfe))
* **frontend:** add profile page ([fce3789](https://github.com/kuskoman/DomainGuard/commit/fce37890e1fc25cceba5b04d9f102f93c5076a4e))
* **frontend:** add prototype of certificate display ([c0f90fa](https://github.com/kuskoman/DomainGuard/commit/c0f90fa7aeab6d0eec83d8d311c2df9645c8c371))
* **frontend:** add prototype of navigation drawer ([eb7ebdd](https://github.com/kuskoman/DomainGuard/commit/eb7ebddd550a12e0385546e2e4161dc2e99cf13b))
* **frontend:** add register page ([f797315](https://github.com/kuskoman/DomainGuard/commit/f79731562632936c697fa40ce58a0e471087bd4d))
* **frontend:** add user profile page ([eed597a](https://github.com/kuskoman/DomainGuard/commit/eed597a38c76c8c8df58b05e832a520589a206b2))
* **frontend:** add user store ([2420654](https://github.com/kuskoman/DomainGuard/commit/24206549574f5aa0df994eb55ab2bc4cb9cec838))
* **frontend:** add vuetify component framework ([af36458](https://github.com/kuskoman/DomainGuard/commit/af364589845d45b220d40662128058aeada9de1b))
* **frontend:** create alertsBar and registerForm ([1bbc6d1](https://github.com/kuskoman/DomainGuard/commit/1bbc6d179fcce0e004c9d898555f3c166dd3d107))
* **frontend:** create login page ([f849a69](https://github.com/kuskoman/DomainGuard/commit/f849a695e93781ad4ebf5f223e59becd5b407d53))
* **frontend:** create prototype of domain list (dashboard) ([3829a40](https://github.com/kuskoman/DomainGuard/commit/3829a405cf570175c5a4ff00fc3b6fd48bb5a1fe))
* **frontend:** create scaffold of the registration view ([923990e](https://github.com/kuskoman/DomainGuard/commit/923990ef9cb434827baa8c50898535ed17d97ead))
* **frontend:** create top navbar ([6e7a267](https://github.com/kuskoman/DomainGuard/commit/6e7a267f9325d0b0eccf4a94e138f177bb8c5709))
* **frontend:** create very basic App.vue ([a4cac66](https://github.com/kuskoman/DomainGuard/commit/a4cac6637ed5a292f4d4d4b55f354f7cc512d672))
* **frontend:** dynamically change to link in index page ([32179e7](https://github.com/kuskoman/DomainGuard/commit/32179e74726f745bfdc1d0b2985263dd6a61c504))
* **frontend:** hide login/register buttons when user is logged ([b9b80ca](https://github.com/kuskoman/DomainGuard/commit/b9b80caee83554584c197e9e4117707c58bc9dca))
* **frontend:** implement PoC of notifications ([ce64b7e](https://github.com/kuskoman/DomainGuard/commit/ce64b7e4130cf847d7d43c2260fc5651411a26d3))
* **frontend:** improve notifications list component ([5116768](https://github.com/kuskoman/DomainGuard/commit/51167686d0516560bd1bd98c1bc527eda0c4ec19))
* **frontend:** improve style, create footer ([619fa5e](https://github.com/kuskoman/DomainGuard/commit/619fa5e61749d3a5ffa56792fd0f867960f78c29))
* **frontend:** initialize frontend repo ([ee46227](https://github.com/kuskoman/DomainGuard/commit/ee4622797cc09a129291a29280c34d9ef7b2725f))
* **frontend:** reinitialize frontend using vuetify ([a1ebc54](https://github.com/kuskoman/DomainGuard/commit/a1ebc5481054b7695c756ab3c00a5f4fc8442f1a))
* **frontend:** start creating stores and handling notifications ([3051ce9](https://github.com/kuskoman/DomainGuard/commit/3051ce93ddc20c590b53bd34038db01b948d6e4b))
* **frontend:** use notification component in the app ([8df08f2](https://github.com/kuskoman/DomainGuard/commit/8df08f2f3b1fe8bd2da888b5b84f8994a3e71928))
* implement basic methods in domains controller ([6da9ee7](https://github.com/kuskoman/DomainGuard/commit/6da9ee7016a946b144afa3b4c4c6cad7a85d3a92))
* implement local auth ([08460be](https://github.com/kuskoman/DomainGuard/commit/08460be6ad29ff65e7865fa2d29364f0ed0e5bc9))
* implement proper user login ([65e0d0c](https://github.com/kuskoman/DomainGuard/commit/65e0d0c43fa2ba710e4e95bf1bee0bea26114f54))
* start implementing user auth using local auth strategy ([65f3f06](https://github.com/kuskoman/DomainGuard/commit/65f3f06b7cd5f8dc9dad96f5c9ea57f9279e5030))


### Bug Fixes

* add missing encryption module ([22ecf78](https://github.com/kuskoman/DomainGuard/commit/22ecf78b505b7138a4e00990f18f15ab6e32f547))
* **backend:** add missing param to session delete endpoint ([49735a9](https://github.com/kuskoman/DomainGuard/commit/49735a999cebbd10377afed34d0c5b6f53bc3500))
* **backend:** add missing repository import ([ca98d48](https://github.com/kuskoman/DomainGuard/commit/ca98d48668bbdbe49149b34deca6493af52a881f))
* **backend:** change import path for notification dto ([e46571b](https://github.com/kuskoman/DomainGuard/commit/e46571bc677014feafc6992b71ece410a7a24c88))
* **backend:** fix domain error notifications ([ebbb745](https://github.com/kuskoman/DomainGuard/commit/ebbb7454df4f1af6d485d6c991db0fc253b5e8bc))
* **backend:** fix log for hostnames found for a domain ([1c772cd](https://github.com/kuskoman/DomainGuard/commit/1c772cd602bc84bf4ead2d10d614cff794035921))
* **backend:** fix param in domain refresh ([07f612f](https://github.com/kuskoman/DomainGuard/commit/07f612f7fbae2bfb4daa2c87eeb31481a1bd8829))
* **backend:** properly parse query params in notifications ([baa9844](https://github.com/kuskoman/DomainGuard/commit/baa984436138b69f17c005c1334a8b089f3abba6))
* **backend:** remove passport and make auth actually work ([cce3ef8](https://github.com/kuskoman/DomainGuard/commit/cce3ef8b0b2ecb020f2e925716c8567163561de6))
* **backend:** replace access_token with accessToken in responses ([54e7d62](https://github.com/kuskoman/DomainGuard/commit/54e7d627d701852df92e2a97e14646bf5312cb58))
* change logged guard to work with express request ([eca9416](https://github.com/kuskoman/DomainGuard/commit/eca94167997e266d749fbdb05c29bad6be3b298a))
* export DbService and make it global ([ca9e484](https://github.com/kuskoman/DomainGuard/commit/ca9e484e838a9b41b6b97631ca08bf6dff659357))
* **frontend:** add authorization header to the request ([966ff36](https://github.com/kuskoman/DomainGuard/commit/966ff36352a98d617c6761bca534cbe7afa09e3e))
* **frontend:** change base url for the api ([498308a](https://github.com/kuskoman/DomainGuard/commit/498308ac4df6139512d996d7645943816a01724d))
* **frontend:** change path for creating a domain ([3fa5b66](https://github.com/kuskoman/DomainGuard/commit/3fa5b661a56705e9d79d5d33e44a1eef71600226))
* **frontend:** display table headers properly ([018bc8a](https://github.com/kuskoman/DomainGuard/commit/018bc8a296dc466b19050abca95d5f536a127cdf))
* **frontend:** make domains details really redirect ([9c5ff48](https://github.com/kuskoman/DomainGuard/commit/9c5ff484282ef4ec830954180d41493bc90a9e13))
* **frontend:** properly handle websocket connection ([111a118](https://github.com/kuskoman/DomainGuard/commit/111a1187658c8e3ba250c01455012a190ec5289f))
* make ssl expiration date nullable ([d35150d](https://github.com/kuskoman/DomainGuard/commit/d35150d8a147c77b4e80a4977c8096dd1f5c89b6))


### Build Configuration

* **backend:** upgrade dependencies ([82626ca](https://github.com/kuskoman/DomainGuard/commit/82626ca91138b874991b3a17fdc7b3c103866778))
* **backend:** upgrade multiple dependencies ([e8aecec](https://github.com/kuskoman/DomainGuard/commit/e8aecec9ffb65dda0d7f8e496d4e0aca371b8a09))
* upgrade dependencies ([31e199e](https://github.com/kuskoman/DomainGuard/commit/31e199e8d759c63858bf2d66edab14d1eb8a35f3))
* upgrade multiple dependencies ([bf71145](https://github.com/kuskoman/DomainGuard/commit/bf7114560c4f0c0064925d8bf7908ca57514c263))


### Tests

* add spec for baseConfig ([f3e4d2c](https://github.com/kuskoman/DomainGuard/commit/f3e4d2ce0e25927c0c1f313e846742335bb5871b))
* add test for swagger setup ([34dfb31](https://github.com/kuskoman/DomainGuard/commit/34dfb312ba21baf6814dba6b2eae4ec2d4740e13))
* create auth controller test ([d74a386](https://github.com/kuskoman/DomainGuard/commit/d74a386a09201114f35202aa5296d6ab1e2c8c10))
* **frontend:** do some of configuration for vitest ([d83a07c](https://github.com/kuskoman/DomainGuard/commit/d83a07cda65edc2246e8f59c9105fb04d0e5e830))
* **frontend:** fix user store tests ([32b52a0](https://github.com/kuskoman/DomainGuard/commit/32b52a07f36b11bc6e3ab5cc5f4f70fdcebb7878))
* remove not working component test ([d8221ee](https://github.com/kuskoman/DomainGuard/commit/d8221eeb21664faaf245f9981834835ffce7e4b1))


### Code Refactoring

* add ApiHeader to domains controller ([2910306](https://github.com/kuskoman/DomainGuard/commit/29103067144c937c5d6dfc9980a23c922cc73fa9))
* add dedicated decorator for userId ([dde93cd](https://github.com/kuskoman/DomainGuard/commit/dde93cd155ea39855d9c3b361052ef201c0fee6c))
* add missing api tags to endpoints ([4e6c7ba](https://github.com/kuskoman/DomainGuard/commit/4e6c7ba94bd8d9e711401e603448fa9d9bd5f84c))
* **backend:** add missing dto annotations ([c8bed9d](https://github.com/kuskoman/DomainGuard/commit/c8bed9d8cf177f76c6fed7fdb6372f254858e350))
* **backend:** add missing serialization to notifications controller ([3e8dbb4](https://github.com/kuskoman/DomainGuard/commit/3e8dbb4e64c554c16c535776250aae149875e16d))
* **backend:** add missing types to sessions service ([1260fb6](https://github.com/kuskoman/DomainGuard/commit/1260fb6e7b52bb71a1a70af1b2b0cfb9353d0d89))
* **backend:** improve domains expiration service ([72ca279](https://github.com/kuskoman/DomainGuard/commit/72ca279d5877c2bfd0445ac1a04fb5d9a2118360))
* **backend:** remove jwt and use redis-based sessions ([4640942](https://github.com/kuskoman/DomainGuard/commit/4640942e572fbed03916062fa64207b5a3db5066))
* **backend:** remove jwt from encryption service, add random string gen ([2b6e454](https://github.com/kuskoman/DomainGuard/commit/2b6e454c3e7fcb9cf87ee60bac349fa0c8327f26))
* **backend:** remove useless comments ([c334332](https://github.com/kuskoman/DomainGuard/commit/c334332e5445682aeda20dc7cd1b20178e84e824))
* **backend:** split domains service into service and repository ([4da3db5](https://github.com/kuskoman/DomainGuard/commit/4da3db5f5bf7fae839e9cdd6cbb569c386d5d207))
* **backend:** use proper types for notification dto ([0d18123](https://github.com/kuskoman/DomainGuard/commit/0d1812386f977d462a35afd098186c6cbcf7f3b0))
* **frontend:** change login and register forms to use new api ([801ee6e](https://github.com/kuskoman/DomainGuard/commit/801ee6ed42dd1b2257a7ea594b0e96eb9fef380c))
* **frontend:** display notifications in a correct order ([2a88fc5](https://github.com/kuskoman/DomainGuard/commit/2a88fc51cde14285e10b1f639d84598eeec8a725))
* **frontend:** improve sorting for domains ([92f5a90](https://github.com/kuskoman/DomainGuard/commit/92f5a90d58a43ce44af765fb076c9662345c8cc8))
* **frontend:** modify the theme to be a little more typical ([84fa379](https://github.com/kuskoman/DomainGuard/commit/84fa37905b60b9d5f2a6d99b34d8e0feb78784d5))
* **frontend:** remove unused code from session list component ([bd83db3](https://github.com/kuskoman/DomainGuard/commit/bd83db38d94049d69e9c4e35cc36abaf7f53e49e))
* **frontend:** split top navbar into multiple components ([150ef09](https://github.com/kuskoman/DomainGuard/commit/150ef09cddb21e2caaecc7f017df3115c81bc22c))
* improve fetching domain expiry data ([7f65c2c](https://github.com/kuskoman/DomainGuard/commit/7f65c2c557dee9aadd96e23dce9fee9636058aed))
* move all backend-related files to dedicated backend directory ([fcfae44](https://github.com/kuskoman/DomainGuard/commit/fcfae44f5451e3f332738a08cff87dfbe663f203))
* remove unused auth guard ([aca440b](https://github.com/kuskoman/DomainGuard/commit/aca440b07edc82e49a461406cc513885286f6a3a))
* rename method responsible for getting domain expiry ([4116071](https://github.com/kuskoman/DomainGuard/commit/4116071febe69f30bc78890e8c11ad189c9dc913))
* use UserId decorator in domains controller ([69b5f4c](https://github.com/kuskoman/DomainGuard/commit/69b5f4c9d92018230bf0f71df0fde5b29d599575))


### Documentation

* add basic readme ([bfb438d](https://github.com/kuskoman/DomainGuard/commit/bfb438d5c977f40035ef50c4769b467943228946))
* add example documentation for university to accept project ([add15f5](https://github.com/kuskoman/DomainGuard/commit/add15f5318e31688b6cc45edeea9f036800ac9c6))
