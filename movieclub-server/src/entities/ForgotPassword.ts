import {Entity, PrimaryColumn, JoinColumn, BaseEntity, OneToOne, Column} from "typeorm";
import {User} from "./User";

@Entity("forgotpassword")
export class ForgotPassword extends BaseEntity {
    @PrimaryColumn()
    token!: string;

    //Valid for only 2 hours
    @Column({type: 'timestamp', nullable: false})
    expires: Date;

    @Column({nullable: false, unique: true})
    userid: string;

    @OneToOne(() => User,{
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "userid"})
    user: User;
}