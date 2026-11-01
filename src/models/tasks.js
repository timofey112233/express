const tasks = [
    { id: 1, title: 'Aaa' },
    { id: 2, title: 'Bbb' }
];

export async function findAll() {
    return tasks;
} 

export async function findById(id) {
    return tasks.find(task => task.id === id) ?? null;
}