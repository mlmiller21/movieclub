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
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const Review_1 = require("./Review");
const Watchlist_1 = require("./Watchlist");
const Favourites_1 = require("./Favourites");
let Movie = class Movie extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("real", { nullable: true }),
    __metadata("design:type", Number)
], Movie.prototype, "userScore", void 0);
__decorate([
    typeorm_1.OneToMany(() => Review_1.Review, review => review.movie),
    __metadata("design:type", Array)
], Movie.prototype, "reviews", void 0);
__decorate([
    typeorm_1.OneToMany(() => Watchlist_1.Watchlist, watchlist => watchlist.movie),
    __metadata("design:type", Array)
], Movie.prototype, "watchlistConnection", void 0);
__decorate([
    typeorm_1.OneToMany(() => Favourites_1.Favourites, Favourites => Favourites.user),
    __metadata("design:type", Array)
], Movie.prototype, "favouritesConnection", void 0);
Movie = __decorate([
    typeorm_1.Entity()
], Movie);
exports.Movie = Movie;
//# sourceMappingURL=Movie.js.map