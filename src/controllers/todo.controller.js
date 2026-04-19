import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const{title, completed, priority, tags, dueDate}= req.body;

    const todo = await Todo.create({title, completed, priority, tags, dueDate});

    res.status(201).json({ok: true, data: todo});

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    let {page= 1, limit= 10, completed, priority, search} = req.query;

    page = parseInt(page);
    limit = parseInt(page);

    const filter = {};
     if (completed !== undefined) {
      filter.completed = completed === "true";
    }
    if(priority){
      filter.priority = priority;
    }
    if(search){
      filter.title = {$regex: search, $options: "i"};
    }

    const total = await Todo.countDocuments(filter);

    const todos = await Todo.find(filter).sort({createdAt :-1}).skip((page - 1)* limit).limit(limit);
    res.json({
      data: todos,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params;

    const todo = await Todo.findById(id);

    if(!todo){
      return res.status(404).json({ok: true, message: "Todo not found"});
    }
    res.json({ok: true, data: todo});
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body,{
      new: true,
      runValidators: true,
    });
    if(!updateTodo){
      return res.status(404).json({ok: false, message: "Todo not found"});
    }
    res.json({ ok: true, data: updatedTodo });

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const{id} = req.params;
    const todo = await Todo.findById(id);

    if(!todo){
      res.status(404).json({ok: false, message: "Todo not found"});
    }
    todo.completed = !todo.completed;
    await todo.save();

    res.json({ok: true, data: todo});
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const{id} = req.params;
    const deleted = await Todo.findByIdAndDelete(id);

    if(!deleted){
      return res.status(404).json({ok: false, message: "Todo not found"});
    }
    res.json(204).send();
    
  } catch (error) {
    next(error);
  }
}
