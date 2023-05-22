export interface TaskInterface {
    title: string,
    summary: string,
    user_id: number,
    created_at: string,
    updated_at: string,
    finished_at?: string,
}