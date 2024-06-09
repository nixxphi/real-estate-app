class GenericService {
    constructor(model) {
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
        return await this.model.find({ deleted: false }).select('-__v -updatedAt -deleted');
      } catch (error) {
        console.error('Error getting all objects:', error);
        throw error;
      }
    }
  
    async search(filter = {}) {
      try {
        const page = filter.page ? parseInt(filter.page, 10) : 1;
        const perPage = filter.limit ? parseInt(filter.limit, 10) : 10;
  
        const query = { ...filter, deleted: filter.hasOwnProperty('deleted') ? filter.deleted : false };
        delete query.page;
        delete query.limit;
  
        const totalCount = await this.model.countDocuments(query);
        const data = await this.model.find(query)
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
  }
  
  export default GenericService;
  