# Security Specification: Arabic Learning Web Application

## 1. Data Invariants
1. **User Identity Invariant**: Documents in `/users/{userId}` can only be created, read, or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Subcollection Isolation**: All subcollections (`progress`, `saved_words`, `quiz_results`) strictly belong to the parent `{userId}`. `request.auth.uid` must match `{userId}` on all operations.
3. **Payload Owner Consistency**: Any `userId` field inside document data must strictly match `request.auth.uid`.
4. **No Blanket Access**: Unauthenticated users (`request.auth == null`) are strictly denied all read and write operations.
5. **ID Hardening**: All IDs (`userId`, `progressId`, `savedWordId`, `quizResultId`) must be valid alphanumeric strings of maximum 128 characters.
6. **Immutable Fields**: `uid` and `createdAt` in `/users/{userId}` cannot be modified after document creation.

## 2. The "Dirty Dozen" Payloads (Must be REJECTED)
1. **Unauthenticated Read**: Anonymous request to `/users/user_123` -> PERMISSION_DENIED.
2. **Cross-User Profile Read**: User `alice_1` reading `/users/bob_2` -> PERMISSION_DENIED.
3. **Cross-User Profile Write**: User `alice_1` writing to `/users/bob_2` -> PERMISSION_DENIED.
4. **Identity Spoofing on Create**: User `alice_1` creating `/users/alice_1` with payload `{ uid: 'bob_2' }` -> PERMISSION_DENIED.
5. **Overlength ID Injection**: Path with 1KB string ID `/users/$(massive_junk_string)` -> PERMISSION_DENIED.
6. **Cross-User Progress Write**: User `alice_1` writing to `/users/bob_2/progress/lesson_1` -> PERMISSION_DENIED.
7. **Cross-User Progress Read**: User `alice_1` reading `/users/bob_2/progress/lesson_1` -> PERMISSION_DENIED.
8. **Shadow Field Injection**: Writing unlisted arbitrary fields into `/users/{userId}/saved_words/{id}` -> PERMISSION_DENIED.
9. **Negative Score Poisoning**: Progress record with negative score `< 0` or NaN -> PERMISSION_DENIED.
10. **Immutable Field Tampering**: User trying to change their immutable `createdAt` timestamp -> PERMISSION_DENIED.
11. **Cross-User Vocabulary Bookmark**: User `alice_1` attempting to delete or modify `/users/bob_2/saved_words/word_1` -> PERMISSION_DENIED.
12. **Blanket Query Scraping**: Attempting collectionGroup or unscoped query across all users' quiz results -> PERMISSION_DENIED.

## 3. Test Runner Design
Any test harness running against the Firestore emulator must verify that requests 1-12 fail with `PERMISSION_DENIED` and valid authenticated requests for the owner succeed.
