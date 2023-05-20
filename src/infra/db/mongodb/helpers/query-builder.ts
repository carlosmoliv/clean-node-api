export class QueryBuilder {
  private readonly query: any = []

  private addStep(step: string, data: object): QueryBuilder {
    this.query.push({ [step]: data })
    return this
  }

  match(data: object): QueryBuilder {
    return this.addStep('$match', data)
  }

  group(data: object): QueryBuilder {
    this.query.push({ $group: data })
    return this.addStep('$group', data)
  }

  sort(data: object): QueryBuilder {
    this.query.push({ $sort: data })
    return this.addStep('$sort', data)
  }

  unwind(data: object): QueryBuilder {
    this.query.push({ $unwind: data })
    return this.addStep('$unwind', data)
  }

  lookup(data: object): QueryBuilder {
    this.query.push({ $lookup: data })
    return this.addStep('$lookup', data)
  }

  project(data: object): QueryBuilder {
    this.query.push({ $project: data })
    return this.addStep('$project', data)
  }

  build(): object[] {
    return this.query
  }
}
