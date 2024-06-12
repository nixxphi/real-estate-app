class GenericService {
  constructor(model) {
    if (!model) {
      throw new Error("Model must be provided to GenericService");
    }
    this.model = model;
  }

  async create(data) {
    try {
      const instance = new this.model(data);
      return await instance.save();
    } catch (error) {
      console.error('Error creating object:', error);
      throw error;
    }
  }

  async update(filter, data) {
    try {
      return await this.model.findOneAndUpdate(filter, data, { new: true }).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error updating object:', error);
      throw error;
    }
  }

  async delete(filter) {
    try {
      return await this.model.findOneAndDelete(filter);
    } catch (error) {
      console.error('Error deleting object:', error);
      throw error;
    }
  }

  async get(filter) {
    try {
      filter = { ...filter, deleted: false };
      return await this.model.findOne(filter).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error finding object:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id).select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error finding object by ID:', error);
      throw error;
    }
  }

  async getAll() {
    try {
      console.log(2);
      return await this.model.find({ deleted: false }).select('-__v -updatedAt -deleted');
      console.log(3);
    } catch (error) {
      console.error('Error getting all objects:', error);
      throw error;
    }
  }

  async search(query) {
    try {
      const page = parseInt(query.page, 10) || 1;
      const perPage = parseInt(query.limit, 10) || 10;

      const filter = { ...query, deleted: query.hasOwnProperty('deleted') ? query.deleted : false };
      delete filter.page;
      delete filter.limit;

      const totalCount = await this.model.countDocuments(filter);
      const data = await this.model.find(filter)
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

  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      console.error('Error counting objects:', error);
      throw error;
    }
  }

  async paginate(filter = {}, pageSize = 10, page = 1) {
    try {
      return await this.model.find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('-__v -updatedAt -deleted');
    } catch (error) {
      console.error('Error paginating objects:', error);
      throw error;
    }
  }

  async findOneOrCreate(filter, data) {
    try {
      const result = await this.model.findOneAndUpdate(filter, data, { upsert: true, new: true });
      return result;
    } catch (error) {
      console.error('Error finding or creating object:', error);
      throw error;
    }
  }
}

export default GenericService;
