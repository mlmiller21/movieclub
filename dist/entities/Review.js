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
exports.Review = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Movie_1 = require("./Movie");
let Review = class Review extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Review.prototype, "userId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Review.prototype, "movieId", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", length: "100", nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "body", void 0);
__decorate([
    typeorm_1.Column({ type: "smallint" }),
    __metadata("design:type", Number)
], Review.prototype, "score", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.reviews, {
        primary: true
    }),
    typeorm_1.JoinColumn({ name: "userId" }),
    __metadata("design:type", User_1.User)
], Review.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Movie_1.Movie, movie => movie.reviews, {
        primary: true
    }),
    typeorm_1.JoinColumn({ name: "movieId" }),
    __metadata("design:type", User_1.User)
], Review.prototype, "movie", void 0);
Review = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Check(`"score" >= 0 AND "score" <= 10`)
], Review);
exports.Review = Review;
//# sourceMappingURL=Review.js.map