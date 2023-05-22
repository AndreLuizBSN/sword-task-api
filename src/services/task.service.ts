import { Filter, FilterType, FilterCompare } from "../interfaces/filter.interface"
import { TaskInterface } from '../interfaces/task.interface';
import { execSql, SQLQuery } from '../core/database';

export const validate = (data: TaskInterface) => {
    var ret:any = new Object();
    ret.ok = true;
    var valInfo = [];
    if ( !data.summary ) {
        valInfo.push({
            'summary': 'O conteúdo precisa ser preenchido',
        })
    }
    if ( data.summary && data.summary.length > 2500 ) {
        valInfo.push({
            'summary': 'O conteúdo pode ter no máximo 2500 caracteres',
        })
    }
    if ( valInfo.length != 0 ) {
        ret.ok = false;
        ret.data = valInfo;
    }
    return ret;
};

export const all = async (filter: Filter) => {
    var val:any = new Object();
    val.ok = true;

    var sql = 'select * from tasks';
    var where:string[] = [];

    if ( filter.other ) {
        filter.other.forEach(f => {
            if ( f.type == FilterType.WHERE ) {
                var sql = f.name;
                if ( f.compare == FilterCompare.IS ) sql += ' is '
                if ( f.compare == FilterCompare.ISNOT ) sql += ' is not '
                if ( f.compare == FilterCompare.EQUAL ) sql += ' = '
                if ( f.compare == FilterCompare.DIFFERENT ) sql += ' <> '
                where.push(`${sql}${f.value}`)
            }
        });
    }

    if ( where.length > 0 ) sql += ' where ' + where.join( ' and ' )

    const query:SQLQuery = {command: sql}

    var user:any = await execSql(query)
    val.data = user
    return val
}

export const show = async (filter:Filter) => {
    var val:any = new Object();
    val.ok = true;

    const query:SQLQuery = {
        command: `select * from tasks where id = $1`,
        options: [filter.id]
    }

    var user:any = await execSql(query)
    val.data = user[0]
    return val
}

export const store = async (data:TaskInterface) => {
    var val = validate( data );

    if ( !val.ok ) {
        return val;
    }

    //criar comando de inserção de dados
    const query:SQLQuery = {
        command: `INSERT INTO tasks(
            title, 
            summary, 
            user_id, 
            created_at, 
            updated_at
        ) VALUES($1, $2, $3, $4, $5)`,
        options: [data.title, data.summary, data.user_id, data.created_at, data.updated_at]
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

export const update = async (id: number, data:TaskInterface) => {
    var val = validate( data );

    if ( !val.ok ) {
        return val;
    }

    //criar comando de inserção de dados
    const query:SQLQuery = {
        command: `update tasks set
            title = $1
            ,summary = $2
            ,user_id = $3
            ,updated_at = $4
            ,finished_at = $5
        where id = $6;`,
        options: [data.title, data.summary, data.user_id, data.updated_at, data.finished_at, id]
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
        command: `delete from tasks 
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
