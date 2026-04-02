package com.chirag.trading.service;

import com.chirag.trading.response.ApiResponse;

public interface ChatbotService {
    ApiResponse getCoinDetails(String prompt) throws Exception;
    String simpleChat(String prompt);
}
