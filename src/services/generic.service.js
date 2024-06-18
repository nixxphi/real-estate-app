const GenericService = (model) => {
  const create = async (data) => {
    try {
      const instance = new model(data);
      return await instance.save();
    } catch (error) {
      console.error('Error creating object:', error);
      throw error;
    }
  }

  const update = async (filter, data) => {
    try {
      return await model.findOneAndUpdate(filter, data, { new: true }).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error updating object:', error);
      throw error;
    }
  }

  const deleteItem = async (filter) => {
    try {
      return await model.findOneAndDelete(filter);
    } catch (error) {
      console.error('Error deleting object:', error);
      throw error;
    }
  }

  const get = async (filter) => {
    try {
      filter = { ...filter, deleted: false };
      return await model.findOne(filter).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error finding object:', error);
      throw error;
    }
  }

  const findById = async (id) => {
    try {
      return await model.findById(id).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error finding object by ID:', error);
      throw error;
    }
  }

  const getAll = async () => {
    try {
      return await model.find({ deleted: false }).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error getting all objects:', error);
      throw error;
    }
  }

  const search = async (query) => {
    try {
      const page = parseInt(query.page, 10) || 1;
      const perPage = parseInt(query.limit, 10) || 10;

      const filter = { ...query };
      delete filter.page;
      delete filter.limit;

      const totalCount = await model.countDocuments(filter);
      const data = await model.find(filter)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .select('-__v -updatedAt -deleted');

      return {
        data,
        currentPage: page,
        totalPages: Math.ceil(totalCount / perPage)
      };
    } catch (error) {
      console.error('Error searching objects:', error);
      throw error;
    }
  }

  const count = async (filter = {}) => {
    try {
      return await model.countDocuments(filter);
    } catch (error) {
      console.error('Error counting objects:', error);
      throw error;
    }
  }

  const paginate = async (filter = {}, pageSize = 10, page = 1) => {
    try {
      const paginationFilter = { ...filter };
      return await model.find(paginationFilter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error paginating objects:', error);
      throw error;
    }
  }

  const findOneOrCreate = async (filter, data) => {
    try {
      const result = await model.findOneAndUpdate(filter, data, { upsert: true, new: true });
      return result;
    } catch (error) {
      console.error('Error finding or creating object:', error);
      throw error;
    }
  }

  return {
    create,
    update,
    delete: deleteItem,
    get,
    findById,
    getAll,
    search,
    count,
    paginate,
    findOneOrCreate
  };
}

export default GenericService;