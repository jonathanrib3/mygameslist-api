interface ISessionsRepository {
  create(user_id: string): Promise<string>;
}

export { ISessionsRepository };
