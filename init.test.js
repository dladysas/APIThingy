import { init } from './init'

test('it should return all projects', async () => {
    const projects = await init()
    expect(projects).toHaveLength(3)
})
