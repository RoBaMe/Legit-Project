import { Module } from "@nestjs/common";
import { ConsoleNotifier } from "./ConsoleNotifier.service";
import { INotifier } from "./INotifier";
import { NOTIFIERS } from "./NotificationsConstants";

@Module({
    providers: [
        ConsoleNotifier,
        {
            provide: NOTIFIERS,
            useFactory: (consoleNotifier: ConsoleNotifier): INotifier[] => {
                return [consoleNotifier];
            },
            inject: [ConsoleNotifier],
        },
    ],
    exports: [NOTIFIERS],
})
export class NotificationsModule {}
