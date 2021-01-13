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
exports.Friends = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Friends = class Friends {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Friends.prototype, "friendOne", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Friends.prototype, "friendTwo", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Friends.prototype, "dateAdded", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.user1ToUser2, { primary: true }),
    typeorm_1.JoinColumn({ name: "friendone" }),
    __metadata("design:type", User_1.User)
], Friends.prototype, "user1", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.user2ToUser1, { primary: true }),
    typeorm_1.JoinColumn({ name: "friendtwo" }),
    __metadata("design:type", User_1.User)
], Friends.prototype, "user2", void 0);
Friends = __decorate([
    typeorm_1.Entity("friends")
], Friends);
exports.Friends = Friends;
//# sourceMappingURL=Friends.js.map