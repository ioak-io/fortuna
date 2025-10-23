import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { VerifyClaimsMiddleware, TenantDbMiddleware, TeamMiddleware } from '@fortuna/middlewares';
import { StudyguideModule } from './studyguide/studyguide.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [FilesModule, StudyguideModule, FlashcardModule, QuizModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyClaimsMiddleware, TenantDbMiddleware, TeamMiddleware)
      .forRoutes('*');
  }
}
