class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      statusCode
    };
  }

  static error(message, error = 'Error', statusCode = 500, details = null) {
    return {
      success: false,
      error,
      message,
      details,
      timestamp: new Date().toISOString(),
      statusCode
    };
  }

  static paginated(data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data,
      pagination: {
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        total_items: total,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
      },
      message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiResponse;
