"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui-library/ui/button";
import { Play, Pause } from "lucide-react";
import { Slider } from "../ui-library/ui/slider";

export interface TTSPlayerRef {
  seekTo: (index: number) => void;
}

interface TTSPlayerProps {
  sentences: string[];
  onSentenceChange?: (index: number) => void;
}

export const TTSPlayer = forwardRef<TTSPlayerRef, TTSPlayerProps>(
  ({ sentences, onSentenceChange }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [rate] = useState(1.0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voicePref] = useState<string>("female");

    const isPlayingRef = useRef(false);

    useEffect(() => {
      isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    /* -------------------- Voice Loader -------------------- */
    useEffect(() => {
      function loadVoices() {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const pickVoice = () => {
      const langVoices = voices.filter((v) => v.lang.startsWith("en"));
      if (langVoices.length === 0) return null;

      const genderMatch = langVoices.find((v) =>
        voicePref === "male"
          ? /(Male|David|Alex|Daniel|George)/i.test(v.name)
          : /(Female|Zira|Samantha|Susan|Victoria|Zoe|Allison|Sofia|Ava)/i.test(
              v.name
            )
      );

      return genderMatch || langVoices[0];
    };

    /* -------------------- Speech Control -------------------- */
    const speakFromSentence = (startIndex: number) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      let i = startIndex;

      const speakNext = () => {
        if (i >= sentences.length) {
          setIsPlaying(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentences[i]);
        utterance.rate = rate;
        utterance.voice = pickVoice() || null;

        utterance.onstart = () => {
          setCurrentSentenceIndex(i);
          onSentenceChange?.(i);
        };

        utterance.onend = () => {
          i++;
          if (i < sentences.length && isPlayingRef.current) {
            speakNext();
          } else {
            setIsPlaying(false);
          }
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNext();
    };

    const handlePlayPause = () => {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          speakFromSentence(currentSentenceIndex);
        }
        setIsPlaying(true);
        isPlayingRef.current = true;
      }
    };

    const handleSeek = (val: number) => {
      setCurrentSentenceIndex(val);
      onSentenceChange?.(val);
      if (isPlaying) {
        window.speechSynthesis.cancel();
        speakFromSentence(val);
      }
    };

    /* -------------------- Expose seekTo to parent -------------------- */
    useImperativeHandle(ref, () => ({
      seekTo: (index: number) => {
        setCurrentSentenceIndex(index);
        onSentenceChange?.(index);
        window.speechSynthesis.cancel();
        speakFromSentence(index);
        setIsPlaying(true);
        isPlayingRef.current = true;
      },
    }));

    useEffect(() => {
      return () => {
        window.speechSynthesis.cancel();
      };
    }, []);

    /* -------------------- UI -------------------- */
    return (
      <div className="flex gap-4 items-center">
        <div className="flex gap-3 items-center justify-end flex-wrap">
          <Button size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <Slider
            value={[currentSentenceIndex]}
            min={0}
            max={sentences.length - 1}
            step={1}
            onValueChange={(val) => handleSeek(val[0])}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground text-right">
            {Math.round((currentSentenceIndex / sentences.length) * 100)}%
          </span>
        </div>
      </div>
    );
  }
);
