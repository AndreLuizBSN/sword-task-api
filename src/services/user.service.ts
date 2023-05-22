import { Filter } from "../interfaces/filter.interface"
import { UserInterface } from '../interfaces/user.interface';
import { passwordConverter } from "./auth.service";
import { execSql, SQLQuery } from '../core/database';

export const validate = (data: UserInterface) => {
    var ret:any = new Object();
    ret.ok = true;
    var valInfo = [];
    if ( !data.email ) {
        valInfo.push({
            'email': 'E-Mail precisa ser preenchido',
        })
    }
    if ( !data.name ) {
        valInfo.push({
            'name': 'Nome precisa ser preenchido',
        })
    }
    if ( data.password != data.password_confirmation ) {
        valInfo.push({
            'password': 'A confirmação de senha precisa ser igual a senha',
        })
    }
    if ( valInfo.length != 0 ) {
        ret.ok = false;
        ret.data = valInfo;
    }
    return ret;
};

export const all = async () => {
    var val:any = new Object();
    val.ok = true;

    const query:SQLQuery = {command: `select id, name, email, type, active, created_at from users order by name asc`}

    var user:any = await execSql(query)
    val.data = user
    return val
}

export const show = async (filter:Filter) => {
    var val:any = new Object();
    val.ok = true;

    const query:SQLQuery = {
        command: `select id, name, email, type, active, created_at from users where id = $1`,
        options: [filter.id]
    }

    var user:any = await execSql(query)
    val.data = user[0]
    return val
}

export const store = async (data:UserInterface) => {
    var val = validate( data );

    if ( !val.ok ) {
        return val;
    }

    data.password = passwordConverter( data.password || '' )

    //criar comando de inserção de dados
    const query:SQLQuery = {
        command: `INSERT INTO users(
            name, 
            email, 
            password, 
            type, 
            active, 
            created_at
        ) VALUES($1, $2, $3, $4, $5, $6)`,
        options: [data.name, data.email, data.password, data.type, data.active, data.created_at]
    }

    try {
        await execSql(query)
        var ret:any = await execSql({command: `select id, email, name, type, active from users where email = '${data.email}'`})
        val.data = ret[0];
    } catch (error) {
        console.log(error);
        
        val.ok = false;
        val.data = error;
    }
    return val   
}

export const update = async (id: number, data:UserInterface) => {
    var val = validate( data );

    if ( !val.ok ) {
        return val;
    }

    data.password = passwordConverter( data.password || '' )

    const query:SQLQuery = {
        command: `update users set
            name = $1
            ${data.password && ', password = $2'}
            ,type = $3
            ,active = $4
        where id = $5;`,
        options: [data.name, data.password, data.type, data.active, id]
    }

    try {
        var ret:any = await execSql(query)

        val.data = ret[0];
    } catch (error) {
        console.log(error);
        
        val.ok = false;
        val.data = error;
    }
    return val 
}

export const drop = async (id: number) => {
    var val = {ok: true};
    const query:SQLQuery = {
        command: `delete from users 
        where id = $1;`,
        options: [id]
    }

    try {
        await execSql(query)
    } catch (error) {
        console.log(error);
        val.ok = false;
    }
    return val 
}