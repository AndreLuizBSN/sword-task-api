import md5 from 'md5';
import { execSql, SQLQuery } from '../core/database';
import { AuthInterface } from '../interfaces/auth.interface';
import { Request, Response, NextFunction, Errback } from 'express';
import { UserType } from '../interfaces/user.interface';


export const login = async ( data: AuthInterface ) => {

    var val:any = new Object();
    val.ok = true;

    var valInfo = [];
    if ( !data.email ) valInfo.push({'email': 'E-mail precisa ser preenchido'})
    if ( !data.password ) valInfo.push({'password': 'Senha precisa ser preenchida'})

    if ( valInfo.length != 0 ) {
        val.ok = false;
        val.data = valInfo;
        return val;
    }

    data.password = passwordConverter( data.password )

    const query:SQLQuery = {
        command: `select * from users where email = $1 and password = $2`,
        options: [data.email, data.password]
    }

    var user:any = await execSql(query)

    if ( user.length === 0 ) {
        valInfo.push({
            'general': 'Usuário inválido'
        })
        val.ok = false;
        val.data = valInfo;
        return val;
    }
    user = user[0];

    var time = new Date().getTime().toString();
    var time2 = new Date().getTime().toString();

    time = md5(time);
    time2 = md5(time2);

    var token = time + '.' + time2;

    const updateQr:SQLQuery = {command: `update users set token = '${token}' where id = ${user.id}`}
    await execSql(updateQr)

    val.data = {
        name: user.name,
        email: data.email,
        token
    }
    return val
}

export const me = async ( token: string ) => {

    var val:any = new Object();
    val.ok = true;

    token = token.split(' ')[1];

    const query:SQLQuery = {command: `select id, name, email, type from users where token = '${token}'`}

    var user:any = await execSql(query)
    val.data = user[0]
    return val
}

/** This is a description of the foo function. */
export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {

    var token = req.headers.authorization;

    if ( !token ) {
        var err:any = new Error('Sem premissão de acesso!');
        err.status = 401;
        return next(err);
    }

    token = token.replace('Bearer ', '')

    const query:SQLQuery = {
        command: `select * from users where token = '${token}'`
    }

    var user:any = await execSql(query)
    if ( user.length == 0 ) {
        var err:any = new Error('Sem premissão de acesso!');
        err.status = 401;
        return next(err);
    }
    
    return next();
}

const loadingUserByType = async(token: string, userType: UserType) => {

    token = token.replace('Bearer ', '')
    
    var typeStr = ( userType == UserType.MANAGER ? 'MANAGER' : 'TECH' );

    const query:SQLQuery = {
        command: `select * from users where token = '${token}'
        and type = '${typeStr}'`
    }

    return await execSql(query)
}

export const isTech = async (req: Request, res: Response, next: NextFunction) => {

    var user:any = await loadingUserByType(req.headers.authorization || '', UserType.TECH);
    if ( user.length == 0 ) {
        var err:any = new Error('Sem premissão de acesso!');
        err.status = 401;
        return next(err);
    }    
    return next();
}

export const isManager = async (req: Request, res: Response, next: NextFunction) => {

    var user:any = await loadingUserByType(req.headers.authorization || '', UserType.MANAGER);
    if ( user.length == 0 ) {
        var err:any = new Error('Sem premissão de acesso!');
        err.status = 401;
        return next(err);
    }    
    return next();
}

export const passwordConverter = ( pass: string ): string => {
    return md5(pass)
}