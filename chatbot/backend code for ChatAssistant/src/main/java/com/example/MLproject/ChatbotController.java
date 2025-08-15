package com.example.MLproject;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@CrossOrigin
@RestController
public class ChatbotController {

    @PostMapping("/chat")
    public Map<String, Object> getChatbotResponse(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();
        String pythonUrl = "http://127.0.0.1:5000/predict";

        // Ensure correct key is sent
        String userPrompt = (String) payload.get("prompt");
        Map<String, Object> request = Map.of("prompt", userPrompt);

        return restTemplate.postForObject(pythonUrl, request, Map.class);
    }
}
