package com.chirag.trading.controller;

import com.chirag.trading.Dto.PromptBody;
import com.chirag.trading.response.ApiResponse;
import com.chirag.trading.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/chat")
public class ChatbotController {
    @Autowired
    private ChatbotService chatbotService;
    @PostMapping()
    public ResponseEntity<ApiResponse> getCoinDetails(@RequestBody PromptBody prompt) throws Exception {
        ApiResponse response = chatbotService.getCoinDetails(prompt.getPrompt());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PostMapping("/simple")
    public ResponseEntity<String>simpleChat(@RequestBody PromptBody prompt) throws Exception {
        String response=chatbotService.simpleChat(prompt.getPrompt());
//        ApiResponse response=new ApiResponse();
//        response.setMessage(prompt.getPrompt());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
