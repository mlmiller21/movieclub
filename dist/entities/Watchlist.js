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
exports.Watchlist = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Movie_1 = require("./Movie");
let Watchlist = class Watchlist extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Watchlist.prototype, "userId", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Watchlist.prototype, "movieId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Watchlist.prototype, "dateAdded", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.watchlistConnection, {
        primary: true
    }),
    typeorm_1.JoinColumn({ name: "userId" }),
    __metadata("design:type", User_1.User)
], Watchlist.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Movie_1.Movie, movie => movie.watchlistConnection, {
        primary: true
    }),
    typeorm_1.JoinColumn({ name: "movieId" }),
    __metadata("design:type", Movie_1.Movie)
], Watchlist.prototype, "movie", void 0);
Watchlist = __decorate([
    typeorm_1.Entity("watchlist")
], Watchlist);
exports.Watchlist = Watchlist;
//# sourceMappingURL=Watchlist.js.map