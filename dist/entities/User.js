"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Friends_1 = require("./Friends");
const Review_1 = require("./Review");
const Watchlist_1 = require("./Watchlist");
const Favourites_1 = require("./Favourites");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true, type: "varchar", length: "50" }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: "varchar", length: "50" }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: "varchar", length: "50" }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Friends_1.Friends, friends => friends.user2),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    typeorm_1.OneToMany(() => Friends_1.Friends, friends => friends.user1),
    __metadata("design:type", Array)
], User.prototype, "friendsInverse", void 0);
__decorate([
    typeorm_1.OneToMany(() => Review_1.Review, review => review.user),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    typeorm_1.OneToMany(() => Watchlist_1.Watchlist, watchlist => watchlist.user),
    __metadata("design:type", Array)
], User.prototype, "watchlistConnection", void 0);
__decorate([
    typeorm_1.OneToMany(() => Favourites_1.Favourites, Favourites => Favourites.user),
    __metadata("design:type", Array)
], User.prototype, "favouritesConnection", void 0);
User = __decorate([
    typeorm_1.Entity("user")
], User);
exports.User = User;
//# sourceMappingURL=User.js.map