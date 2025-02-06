import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { apiClient } from "@/lib/api";
import type { Character } from "@elizaos/core";
import { useToast } from "@/hooks/use-toast";
import React, { ChangeEvent } from "react";
import { Input } from "./ui/input";

enum ModelProviderName {
    OPENAI = "openai",
    ETERNALAI = "eternalai",
    ANTHROPIC = "anthropic",
    GROK = "grok",
    GROQ = "groq",
    LLAMACLOUD = "llama_cloud",
    TOGETHER = "together",
    LLAMALOCAL = "llama_local",
    GOOGLE = "google",
    MISTRAL = "mistral",
    CLAUDE_VERTEX = "claude_vertex",
    REDPILL = "redpill",
    OPENROUTER = "openrouter",
    OLLAMA = "ollama",
    HEURIST = "heurist",
    GALADRIEL = "galadriel",
    FAL = "falai",
    GAIANET = "gaianet",
    ALI_BAILIAN = "ali_bailian",
    VOLENGINE = "volengine",
    NANOGPT = "nanogpt",
    HYPERBOLIC = "hyperbolic",
    VENICE = "venice",
    NINETEEN_AI = "nineteen_ai",
    AKASH_CHAT_API = "akash_chat_api",
    LIVEPEER = "livepeer",
    LETZAI = "letzai",
    DEEPSEEK = "deepseek",
    INFERA = "infera",
}

const defaultCharacter: Character = {
    name: "default name",
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    settings: {
        voice: {
            model: "",
        },
    },
    plugins: [],
    bio: [],
    lore: [],
    knowledge: [],
    messageExamples: [],
    postExamples: [],
    topics: [],
    style: {
        all: [],
        chat: [],
        post: [],
    },
    adjectives: [],
};

export const CharacterManager = () => {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const [character, setCharacter] =
        React.useState<Character>(defaultCharacter);

    const [file, setFile] = React.useState<File>();

    const { mutateAsync: saveCharacter } = useMutation({
        // mutationKey: ["saveCharacter"],
        mutationFn: async () => {
            await apiClient.saveCharacter(character);
            return apiClient.restartAgent(character);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            toast({
                title: "Character saved",
            });
        },
        onError(error) {
            toast({
                title: error.message,
                variant: "destructive",
            });
        },
    });

    const { mutateAsync: saveKnowledgeFile } = useMutation({
        // mutationKey: ["saveCharacter"],
        mutationFn: apiClient.saveKnowledge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            toast({
                title: "Character saved",
            });
        },
        onError(error) {
            toast({
                title: error.message,
                variant: "destructive",
            });
        },
    });

    const onSaveCharacter = async () => {
        saveCharacter();
    };

    const onFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFile(file);
    };

    const onSaveFile = async () => {
        if (file) {
            saveKnowledgeFile({
                agentId: "b850bc30-45f8-0041-a00a-83df46d8555d",
                file,
            });
        }
    };

    return (
        <div className="p-10 h-full">
            <Textarea
                onChange={(e) => setCharacter(JSON.parse(e.target.value))}
                defaultValue={JSON.stringify(defaultCharacter, null, 2)}
                className="w-[50%] h-[50%]"
            />
            <Button className="mt-5" onClick={onSaveCharacter}>
                Save and restart
            </Button>

            <Input onChange={onFileUpload} type="file" />

            <Button className="mt-5" onClick={onSaveFile}>
                Save and restart
            </Button>
        </div>
    );
};
